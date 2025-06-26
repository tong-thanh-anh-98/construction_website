<?php

namespace App\Http\Controllers\front;

use App\Models\Service;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllServices()
    {
        try {
            $services = Service::where('status', 1)->orderBy('created_at', 'desc')->get();

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
     * Display a listing of the resource.
     */
    public function latestServices(Request $request)
    {
        try {
            $services = Service::orderBy('created_at', 'desc')
                ->where('status', 1)
                ->limit($request->limit)
                ->get();

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
}
