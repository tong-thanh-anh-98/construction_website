<?php

namespace App\Http\Controllers\front;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllProjects()
    {
        try {
            $projects = Project::where('status', 1)->orderBy('created_at', 'desc')->get();

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
     * Display a listing of the resource.
     */
    public function latestProjects(Request $request)
    {
        try {
            $projects = Project::orderBy('created_at', 'desc')
                ->where('status', 1)
                ->limit($request->limit)
                ->get();

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
     * Method detailProject
     *
     * @param $id
     *
     * @return void
     */
    public function detailProject($id)
    {
        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status'        => 404,
                    'message'       => __('message.not_found')
                ], 404);
            }

            return response()->json([
                'status'        => 200,
                'message'       => __('message.success'),
                'data'      => $project
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List errors: ' . $e->getMessage());

            return response()->json([
                'status'        => 500,
                'message'       => __('message.server_error')
            ], 500);
        }
    }
}
