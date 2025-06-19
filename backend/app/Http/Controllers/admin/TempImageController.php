<?php

namespace App\Http\Controllers\admin;

use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use Illuminate\Support\Facades\Validator;

class TempImageController extends Controller
{
    protected $imageService;

    public function __construct(ImageUploadService $imageService)
    {
        $this->imageService = $imageService;
    }

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
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => "Bad Request",
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $model = $this->imageService->storeTempImage($request->image);

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Uploaded Successfully.',
                'data'      => $model
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => 'Internal Server Error.',
                'error'     => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $image = TempImage::find($id);

            if (!$image) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Not Found.',
                ], 404);
            }

            return response()->json([
                'status' => 200,
                'message' => 'Successfully.',
                'data' => [
                    'id' => $image->id,
                    'name' => $image->name,
                    'url' => asset('uploads/temp/' . $image->name),
                    'thumb_url' => asset('uploads/temp/thumb/' . $image->name),
                    'created_at' => $image->created_at,
                    'updated_at' => $image->updated_at,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error.',
                'error' => $e->getMessage(), // Ẩn nếu cần bảo mật
            ], 500);
        }
    }


    public function removeTempImage($id)
    {
        try {
            $image = TempImage::find($id);

            if (!$image) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Not Found.',
                ], 404);
            }

            $this->imageService->deleteTempImage($image->id);

            return response()->json([
                'status' => 200,
                'message' => 'Deleted Successfully.',
            ]);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error.',
                'error' => $e->getMessage(), // Có thể ẩn nếu không muốn expose lỗi
            ], 500);
        }
    }
}
