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

    public function __construct()
    {
        $this->manager = new ImageManager(Driver::class);
    }

    /**
     * Upload tạm thời (TempImage), lưu cả bản thumb
     */
    public function storeTempImage(UploadedFile $file): TempImage
    {
        try {
            $ext = $file->extension();
            $fileName = Str::uuid() . '.' . $ext;

            $tempDir = public_path('uploads/temp');
            $thumbDir = public_path('uploads/temp/thumb');

            $this->makeDirectories([$tempDir, $thumbDir]);

            $file->move($tempDir, $fileName);
            // $this->manager->read($tempDir . '/' . $fileName)
            //     ->coverDown(720, 480)
            //     ->save($thumbDir . '/' . $fileName);
            $originalPath = $tempDir . '/' . $fileName;
            $thumbPath = $thumbDir . '/' . $fileName;

            // Kiểm tra file đã được lưu chưa
            if (!file_exists($originalPath)) {
                throw new ImageUploadException("File not saved after move.");
            }

            // Tạo thumb
            $this->manager->read($originalPath)
                ->coverDown(720, 480)
                ->save($thumbPath);

            $tempImage = TempImage::create(['name' => $fileName]);

            return $tempImage;
        } catch (\Throwable $e) {
            Log::error('Temp image upload failed: ' . $e->getMessage());
            throw new ImageUploadException('Failed to upload temporary image.');
        }
    }

    /**
     * Chuyển ảnh từ thư mục tạm sang thư mục chính thức
     */
    public function moveTempToPermanent(string $type, int $ownerId, int $tempImageId): string
    {
        try {
            $tempImage = TempImage::find($tempImageId);
            if (!$tempImage) {
                throw new ImageUploadException('Temp image not found.');
            }

            $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
            $fileName = Str::uuid() . '_' . $ownerId . '.' . $ext;

            $sourcePath = public_path('uploads/temp/' . $tempImage->name);

            $largePath  = public_path("uploads/{$type}/large");
            $smallPath  = public_path("uploads/{$type}/small");

            $this->makeDirectories([$largePath, $smallPath]);

            // // Small
            // $this->manager->read($sourcePath)
            //     ->coverDown(720, 480)
            //     ->save($smallPath . '/' . $fileName);
            // // Large
            // $this->manager->read($sourcePath)
            //     ->scaleDown(1024, 768)
            //     ->save($largePath . '/' . $fileName);

            // Kiểm tra file tồn tại
            if (!file_exists($sourcePath)) {
                Log::error("Source file not found: {$sourcePath}");

                // Cleanup DB nếu cần
                $tempImage->delete();

                throw new ImageUploadException("Temporary image file does not exist.");
            }

            // Tiếp tục resize nếu file tồn tại
            $this->manager->read($sourcePath)
                ->coverDown(720, 480)
                ->save($smallPath . '/' . $fileName);

            // Large
            $this->manager->read($sourcePath)
                ->scaleDown(1024, 768)
                ->save($largePath . '/' . $fileName);

            return $fileName;
        } catch (\Throwable $e) {
            Log::error("Move temp to permanent failed for type {$type}: " . $e->getMessage());
            throw new ImageUploadException('Failed to move image to permanent location.');
        }
    }

    /**
     * Xóa ảnh chính thức (large và small)
     */
    public function deletePermanentImage(string $type, string $fileName): void
    {
        try {
            if (!$fileName) return;

            $large = public_path("uploads/{$type}/large/{$fileName}");
            $small = public_path("uploads/{$type}/small/{$fileName}");

            File::delete([$large, $small]);
        } catch (\Throwable $e) {
            Log::error("Delete permanent image failed [{$type}/{$fileName}]: " . $e->getMessage());
        }
    }

    /**
     * Xóa ảnh tạm (file + record DB)
     */
    public function deleteTempImage(int $tempImageId): void
    {
        try {
            $image = TempImage::find($tempImageId);
            if (!$image) return;

            $originalPath = public_path('uploads/temp/' . $image->name);
            $thumbPath = public_path('uploads/temp/thumb/' . $image->name);

            File::delete([$originalPath, $thumbPath]);
            $image->delete();
        } catch (\Throwable $e) {
            Log::error('Delete temp image failed: ' . $e->getMessage());
        }
    }

    /**
     * Tạo các thư mục nếu chưa có
     */
    protected function makeDirectories(array $paths): void
    {
        foreach ($paths as $path) {
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
        }
    }
}
