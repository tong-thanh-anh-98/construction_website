<?php

namespace App\Http\Controllers\admin;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use App\Http\Requests\ProjectRequest;

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
                'message' => __('message.success'),
                'data'    => $projects
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
    public function store(ProjectRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractProjectData($request);

            $project = Project::create($data);

            if ($request->has('imageId')) {
                $fileName = $this->imageProject->moveTempToPermanent('projects', $project->id, $request->imageId);
                $project->update(['image' => $fileName]);
            }

            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.create_success'),
                'data'      => $project
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
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $project
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
    public function update(ProjectRequest  $request, $id)
    {
        DB::beginTransaction();

        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            $data = $this->extractProjectData($request);

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
                'message' => __('message.update_success'),
                'data'      => $project
            ], 200);
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }
            // xóa ảnh trong thư mục nếu xóa project
            if ($project->image) {
                $this->imageProject->deletePermanentImage('projects', $project->image);
            }

            $project->delete();

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

    /**
     * Method extractProjectData
     */
    private function extractProjectData(ProjectRequest $request)
    {
        return $request->only([
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
    }
}
