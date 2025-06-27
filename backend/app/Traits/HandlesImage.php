<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait HandlesImage
{
    /**
     * Method handleImageStore
     *
     * @param Request $request
     * @param object $model
     * @param string $type
     * @param $uploadService
     *
     * @return string
     */
    protected function handleImageStore(Request $request, object $model, string $type, $uploadService): void
    {
        if ($request->filled('imageId') && is_numeric($request->imageId)) {
            $fileName = $uploadService->moveTempToPermanent($type, $model->id, (int) $request->imageId);
            $model->update(['image' => $fileName]);
        }
    }

    /**
     * Method handleImageUpdate
     *
     * @param Request $request
     * @param object $model
     * @param string $type
     * @param $uploadService
     *
     * @return string
     */
    protected function handleImageUpdate(Request $request, object $model, string $type, $uploadService): ?string
    {
        $hasNewImage = $request->filled('imageId') && is_numeric($request->imageId);
        $removeOld   = $request->boolean('removeImage');

        // TH1: Có ảnh mới, chuyển từ temp sang permanent
        if ($hasNewImage) {
            $fileName = $uploadService->moveTempToPermanent($type, $model->id, (int)$request->imageId);

            if ($model->image) {
                $uploadService->deletePermanentImage($type, $model->image);
            }

            return $fileName;
        }

        // TH2: Chỉ xóa ảnh nếu không có ảnh mới đi kèm
        if ($removeOld && !$hasNewImage) {
            if ($model->image) {
                $uploadService->deletePermanentImage($type, $model->image);
            }

            return null;
        }

        return $model->image;
    }

    /**
     * Method handleImageDestroy
     *
     * @param object $model
     * @param string $type
     * @param $uploadService
     */
    protected function handleImageDestroy(object $model, string $type, $uploadService): void
    {
        if ($model->image) {
            $uploadService->deletePermanentImage($type, $model->image);
        }
    }
}
