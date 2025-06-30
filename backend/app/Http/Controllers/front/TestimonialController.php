<?php

namespace App\Http\Controllers\front;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class TestimonialController extends Controller
{
    public function getAllTestimonials()
    {
        try {
            $testimonials = Testimonial::where('status', 1)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status'        => 200,
                'message'       => __('message.success'),
                'data'      => $testimonials
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List error: ' . $e->getMessage());

            return response()->json([
                'status'        => 500,
                'message'       => __('message.server_error'),
                'error'         => $e->getMessage()
            ], 500);
        }
    }

    public function latestTestimonials(Request $request)
    {
        try {
            $testimonials = Testimonial::orderBy('created_at', 'desc')
                ->where('status', 1)
                ->limit($request->limit)
                ->get();

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $testimonials
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.server_error'),
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
