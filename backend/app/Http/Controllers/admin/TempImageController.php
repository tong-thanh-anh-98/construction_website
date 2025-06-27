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
    protected $imageTemp;

    public function __construct(ImageUploadService $imageTemp)
    {
        $this->imageTemp = $imageTemp;
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
                'message' => __('message.bad_request'),
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $model = $this->imageTemp->storeTempImage($request->image);

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message' => __('message.upload_success'),
                'data'      => $model
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.server_error'),
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
                    'message' => __('message.not_found'),
                ], 404);
            }

            return response()->json([
                'status' => 200,
                'message' => __('message.success'),
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
                'message' => __('message.server_error'),
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
                    'message' => __('message.not_found'),
                ], 404);
            }

            $this->imageTemp->deleteTempImage($image->id);

            return response()->json([
                'status' => 200,
                'message' => __('message.delete_success'),
            ]);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('message.server_error'),
            ], 500);
        }
    }
}
