<?php

namespace App\Http\Controllers\admin;

use App\Models\TempImage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TempImageController extends Controller
{
    /**
     * Method store
     *
     * @param Request $request
     *
     * @return void
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors()
                ], 400);
            }

            $image = $request->image;
            $ext =  $image->extension();
            $imageName = Str::uuid() . '.' . $ext;

            // save image in table database
            $model = new TempImage();
            $model->name = $imageName;
            $model->save();

            // Define directories
            $tempDir = public_path('uploads/temp');
            $thumbDir = public_path('uploads/temp/thumb');

            // Auto-create temp directory if it doesn't exist
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            // Auto-create thumb directory if it doesn't exist
            if (!file_exists($thumbDir)) {
                mkdir($thumbDir, 0755, true);
            }

            // Save image in uploads/temp
            $image->move($tempDir, $imageName);

            // Create thumbnail
            $sourcePath = $tempDir . '/' . $imageName;
            $destPath = $thumbDir . '/' . $imageName;

            // Using this method you must create a folder before saving.
            // $image->move(public_path('uploads/temp'), $imageName);
            // $sourcePath = public_path('uploads/temp/' . $imageName);
            // $destPath = public_path('uploads/temp/thumb'. $imageName);

            $manager = new ImageManager(Driver::class);
            $image = $manager->read($sourcePath);
            $image->coverDown(450, 450);
            $image->save($destPath);

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Successfully.',
                'data'      => $model
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => 'Failed.',
                'error'     => $e->getMessage()
            ], 500);
        }
    }
}
