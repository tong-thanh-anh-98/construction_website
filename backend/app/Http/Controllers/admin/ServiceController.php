<?php

namespace App\Http\Controllers\admin;

use App\Models\Service;
use App\Models\TempImage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use App\Http\Requests\ServiceRequest;
use Intervention\Image\Drivers\Gd\Driver;

class ServiceController extends Controller
{
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

            // Khởi tạo trước để có $serviceId cho tên file
            $service = Service::create($data);

            // Nếu có ảnh tạm, xử lý ảnh và gán tên ảnh vào
            $fileName = null;
            if ($request->has('imageId') && (int)$request->imageId > 0) {
                $fileName = $this->handleImageUpload($request->imageId, $service->id);

                if ($fileName) {
                    $service->update(['image' => $fileName]);
                }
            }

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Successfully.',
                'data'      => $service
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

            // save temp image here
            $fileName = null;
            if ($request->has('imageId') && (int)$request->imageId > 0) {
                $fileName = $this->handleImageUpload($request->imageId, $service->id);

                if ($fileName) {
                    // Xóa ảnh cũ nếu có
                    $this->deleteOldImages($service->image);
                    $data['image'] = $fileName;
                }
            }

            // Nếu yêu cầu xoá ảnh mà không upload ảnh mới
            if ($request->has('removeImage') && $request->removeImage && !$fileName) {
                $this->deleteOldImages($service->image); // xoá file vật lý
                $data['image'] = null; // set lại DB
            }

            $service->update($data);

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Successfully.',
                'data'      => $service
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

    private function handleImageUpload($imageId, $serviceId)
    {
        $tempImage = TempImage::find($imageId);
        if (!$tempImage) return null;

        // pathinfo() là một hàm PHP dùng để lấy thông tin về đường dẫn của file,
        // là hằng số truyền vào để chỉ lấy đuôi file (ví dụ: jpg, png, webp, v.v.)
        $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
        $fileName = Str::uuid() . '_' . $serviceId . '.' . $ext;

        $sourcePath = public_path('uploads/temp/' . $tempImage->name);
        $largePath  = public_path('uploads/services/large');
        $smallPath  = public_path('uploads/services/small');

        // Create directory if not exists
        foreach ([$largePath, $smallPath] as $path) {
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
        }

        $manager = new ImageManager(Driver::class);

        // Create thumbnail
        $smallImage = $manager->read($sourcePath);
        $smallImage->coverDown(500, 600);
        $smallImage->save($smallPath . '/' . $fileName);

        // Create large image
        $largeImage = $manager->read($sourcePath);
        $largeImage->scaleDown(1200);
        $largeImage->save($largePath . '/' . $fileName);

        return $fileName;
    }

    private function deleteOldImages($oldImage)
    {
        if (!$oldImage) return;

        $large = public_path('uploads/services/large/' . $oldImage);
        $small = public_path('uploads/services/small/' . $oldImage);

        File::delete([$large, $small]);
    }
}
