<?php

namespace App\Services;

use App\Models\TempImage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use App\Exceptions\ImageUploadException;
use Intervention\Image\Drivers\Gd\Driver;

class ImageUploadService
{
    protected $manager;

    /**
     * Method __construct
     *
     * @return void
     */
    public function __construct()
    {
        $this->manager = new ImageManager(Driver::class);
    }

    /**
     * Method storeTempImage
     *
     * @param UploadedFile $file
     *
     * @return TempImage
     */
    public function storeTempImage(UploadedFile $file): TempImage
    {
        $fileName = Str::uuid() . '.' . $file->extension();
        $originalPath = public_path("uploads/temp/{$fileName}");
        $thumbPath = public_path("uploads/temp/thumb/{$fileName}");

        try {
            $this->makeDirectories([
                dirname($originalPath),
                dirname($thumbPath)
            ]);

            $file->move(dirname($originalPath), $fileName);

            if (!file_exists($originalPath)) {
                throw new ImageUploadException("File not saved after move.");
            }

            $this->resizeImage($originalPath, $thumbPath, 720, 480);

            return TempImage::create(['name' => $fileName]);
        } catch (\Throwable $e) {
            Log::error('Temp image upload failed: ' . $e->getMessage());
            throw new ImageUploadException('Failed to upload temporary image.');
        }
    }

    /**
     * Method moveTempToPermanent
     *
     * @param string $type
     * @param int $ownerId
     * @param int $tempImageId
     *
     * @return string
     */
    public function moveTempToPermanent(string $type, int $ownerId, int $tempImageId): string
    {
        $tempImage = TempImage::find($tempImageId);

        if (!$tempImage) {
            throw new ImageUploadException('Temp image not found.');
        }

        $sourcePath = public_path('uploads/temp/' . $tempImage->name);

        if (!file_exists($sourcePath)) {
            Log::error("Source file not found: {$sourcePath}");
            $tempImage->delete();
            throw new ImageUploadException("Temporary image file does not exist.");
        }

        $fileName = Str::uuid() . "_{$ownerId}." . pathinfo($tempImage->name, PATHINFO_EXTENSION);

        $largePath = public_path("uploads/{$type}/large/{$fileName}");
        $smallPath = public_path("uploads/{$type}/small/{$fileName}");

        try {
            $this->makeDirectories([
                dirname($largePath),
                dirname($smallPath)
            ]);

            $this->resizeImage($sourcePath, $smallPath, 720, 480);
            $this->resizeImage($sourcePath, $largePath, 1024, 768, 'scaleDown');

            return $fileName;
        } catch (\Throwable $e) {
            Log::error("Move temp to permanent failed [{$type}]: " . $e->getMessage());
            throw new ImageUploadException('Failed to move image to permanent location.');
        }
    }

    /**
     * Method deletePermanentImage
     *
     * @param string $type
     * @param string $fileName
     *
     * @return void
     */
    public function deletePermanentImage(string $type, string $fileName): void
    {
        if (!$fileName) return;

        File::delete([
            public_path("uploads/{$type}/large/{$fileName}"),
            public_path("uploads/{$type}/small/{$fileName}")
        ]);
    }

    /**
     * Method deleteTempImage
     *
     * @param int $tempImageId
     *
     * @return void
     */
    public function deleteTempImage(int $tempImageId): void
    {
        $image = TempImage::find($tempImageId);
        if (!$image) return;

        File::delete([
            public_path("uploads/temp/{$image->name}"),
            public_path("uploads/temp/thumb/{$image->name}")
        ]);

        $image->delete();
    }

    /**
     * Method makeDirectories
     *
     * @param array $paths
     *
     * @return void
     */
    protected function makeDirectories(array $paths): void
    {
        foreach ($paths as $path) {
            if (!is_dir($path)) {
                mkdir($path, 0755, true);
            }
        }
    }

    /**
     * Method resizeImage
     *
     * @param string $inputPath
     * @param string $outputPath
     * @param int $width
     * @param int $height
     * @param string $mode
     *
     * @return void
     */
    protected function resizeImage(string $inputPath, string $outputPath, int $width, int $height, string $mode = 'coverDown'): void
    {
        $image = $this->manager->read($inputPath);
        $resized = $mode === 'scaleDown'
            ? $image->scaleDown($width, $height)
            : $image->coverDown($width, $height);
        $resized->save($outputPath);
    }
}
