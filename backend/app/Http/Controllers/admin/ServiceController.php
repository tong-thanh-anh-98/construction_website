<?php

namespace App\Http\Controllers\admin;

use App\Models\Service;
use App\Traits\HandlesImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use App\Http\Requests\ServiceRequest;

class ServiceController extends Controller
{
    use HandlesImage;

    protected $imageService;

    public function __construct(ImageUploadService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $services = Service::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $services
            ], 200);
        } catch (\Exception $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.server_error'),
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServiceRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->only([
                'title',
                'slug',
                'short_desc',
                'content',
                'status'
            ]);

            $service = Service::create($data);

            // if ($request->has('imageId')) {
            //     $fileName = $this->imageService->moveTempToPermanent('services', $service->id, $request->imageId);
            //     $service->update(['image' => $fileName]);
            // }

            // Gọi trait để tải ảnh lên
            $this->handleImageStore($request, $service, 'services', $this->imageService);

            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.create_success'),
                'data'      => $service
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message' => __('message.server_error'),
                'error'     => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $service = Service::find($id);

            if (!$service) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $service
            ], 200);
        } catch (\Exception $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.server_error'),
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $service = Service::find($id);

            if (!$service) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $data = $request->only([
                'title',
                'slug',
                'short_desc',
                'content',
                'status',
            ]);

            // if ($request->filled('imageId') && is_numeric($request->imageId)) {
            //     // Có ảnh mới → chuyển từ temp sang permanent
            //     $tempImageId = (int) $request->imageId;
            //     $fileName = $this->imageService->moveTempToPermanent('services', $service->id, $tempImageId);
            //     // Xóa ảnh cũ nếu có
            //     if ($service->image) {
            //         $this->imageService->deletePermanentImage('services', $service->image);
            //     }
            //     $data['image'] = $fileName;
            // } elseif ($request->boolean('removeImage') && !$request->filled('imageId')) {
            //     // Chỉ xóa ảnh nếu không có ảnh mới đi kèm
            //     if ($service->image) {
            //         $this->imageService->deletePermanentImage('services', $service->image);
            //     }
            //     $data['image'] = null;
            // }

            // Gọi trait để xóa ảnh
            $data['image'] = $this->handleImageUpdate($request, $service, 'services', $this->imageService);

            $service->update($data);

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message' => __('message.update_success'),
                'data'      => $service
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Service Update Error: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message' => __('message.server_error'),
                'error'     => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $service = Service::find($id);

            if (!$service) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            // // xóa hình ảnh trong thư mục nếu xóa services
            // if ($service->image) {
            //     $this->imageService->deletePermanentImage('services', $service->image);
            // }

            // Gọi trait để xóa ảnh khi xóa service
            $this->handleImageDestroy($service, 'services', $this->imageService);
            $service->delete();

            return response()->json([
                'status'  => 200,
                'message' => __('message.delete_success'),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.server_error'),
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
