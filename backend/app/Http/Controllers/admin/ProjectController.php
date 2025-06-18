<?php

namespace App\Http\Controllers\admin;

use App\Models\Project;
use App\Models\TempImage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use App\Http\Requests\ProjectRequest;
use Intervention\Image\Drivers\Gd\Driver;

class ProjectController extends Controller
{
    protected $imageProject;

    public function __construct(ImageUploadService $imageProject)
    {
        $this->imageProject = $imageProject;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $projects = Project::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'  => 200,
                'message' => 'Display successfully.',
                'data'    => $projects
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
    public function store(ProjectRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->only([
                'title',
                'slug',
                'short_desc',
                'content',
                'construction_type',
                'sector',
                'location',
                'image',
                'status'
            ]);

            $project = Project::create($data);

            if ($request->has('imageId')) {
                $fileName = $this->imageProject->moveTempToPermanent('projects', $project->id, $request->imageId);
                $project->update(['image' => $fileName]);
            }

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Created successfully.',
                'data'      => $project
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
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status'    => 400,
                    'message'   => 'Data not found.',
                ], 400);
            }

            return response()->json([
                'status'  => 200,
                'message' => 'Display successfully.',
                'data'    => $project
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
    public function update(ProjectRequest  $request, $id)
    {
        DB::beginTransaction();

        try {
            $project = Project::find($id);

            if (!$project) {
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
                'construction_type',
                'sector',
                'location',
                'image',
                'status'
            ]);

            if ($request->filled('imageId') && is_numeric($request->imageId)) {
                // Có ảnh mới → chuyển từ temp sang permanent
                $tempImageId = (int) $request->imageId;
                $fileName = $this->imageProject->moveTempToPermanent('projects', $project->id, $tempImageId);
                // Xóa ảnh cũ nếu có
                if ($project->image) {
                    $this->imageProject->deletePermanentImage('projects', $project->image);
                }
                $data['image'] = $fileName;
            } elseif ($request->boolean('removeImage') && !$request->filled('imageId')) {
                // Chỉ xóa ảnh nếu không có ảnh mới đi kèm
                if ($project->image) {
                    $this->imageProject->deletePermanentImage('projects', $project->image);
                }
                $data['image'] = null;
            }

            $project->update($data);

            DB::commit();

            return response()->json([
                'status'    => 200,
                'message'   => 'Updated successfully.',
                'data'      => $project
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
    public function destroy(string $id)
    {
        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status'    => 400,
                    'message'   => 'Data not found.',
                ], 400);
            }

            $project->delete();

            return response()->json([
                'status'  => 200,
                'message'    => 'Deleted successfully.'
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
