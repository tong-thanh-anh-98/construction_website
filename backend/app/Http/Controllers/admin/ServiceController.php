<?php

namespace App\Http\Controllers\admin;

use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use App\Http\Requests\ServiceRequest;

class ServiceController extends Controller
{
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
                'message' => 'Successfully.',
                'data'    => $services
            ], 200);
        } catch (\Exception $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => 'Failed.',
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

            if ($request->has('imageId')) {
                $fileName = $this->imageService->moveTempToPermanent('services', $service->id, $request->imageId);
                $service->update(['image' => $fileName]);
            }

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Successfully created.',
                'data'      => $service
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => 'Creation failed.',
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
                    'status'    => 400,
                    'message'   => 'Data not found.',
                ], 400);
            }

            return response()->json([
                'status'  => 200,
                'data'    => $service
            ], 200);
        } catch (\Exception $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => 'Failed.',
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
                    'status'    => 400,
                    'message'   => 'Data not found.',
                ], 400);
            }

            $data = $request->only([
                'title',
                'slug',
                'short_desc',
                'content',
                'status',
            ]);

            if ($request->filled('imageId') && is_numeric($request->imageId)) {
                // Có ảnh mới → chuyển từ temp sang permanent
                $tempImageId = (int) $request->imageId;
                $fileName = $this->imageService->moveTempToPermanent('services', $service->id, $tempImageId);
                // Xóa ảnh cũ nếu có
                if ($service->image) {
                    $this->imageService->deletePermanentImage('services', $service->image);
                }
                $data['image'] = $fileName;
            } elseif ($request->boolean('removeImage') && !$request->filled('imageId')) {
                // Chỉ xóa ảnh nếu không có ảnh mới đi kèm
                if ($service->image) {
                    $this->imageService->deletePermanentImage('services', $service->image);
                }
                $data['image'] = null;
            }

            $service->update($data);

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Successfully updated.',
                'data'      => $service
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Service Update Error: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => 'Update failed.',
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
                    'status'    => 400,
                    'message'   => 'Data not found.',
                ], 400);
            }

            $service->delete();

            return response()->json([
                'status'  => 200,
                'message'    => 'Successfully.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => 'Failed.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
