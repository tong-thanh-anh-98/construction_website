<?php

namespace App\Http\Controllers\admin;

use App\Models\Testimonial;
use App\Traits\HandlesImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use App\Http\Requests\TestimonialRequest;

class TestimonialController extends Controller
{
    use HandlesImage;

    protected $imageTestimonial;

    public function __construct(ImageUploadService $imageTestimonial)
    {
        $this->imageTestimonial = $imageTestimonial;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $testimonials = Testimonial::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $testimonials
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.server_error'),
                'error'     => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(TestimonialRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractTestimonialData($request);
            $testimonial = Testimonial::create($data);

            // Gọi trait xử lý ảnh
            $this->handleImageStore($request, $testimonial, 'testimonials', $this->imageTestimonial);

            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.create_success'),
                'data'      => $testimonial
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
            $testimonial = Testimonial::find($id);

            if (!$testimonial) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $testimonial
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

    /**
     * Update the specified resource in storage.
     */
    public function update(TestimonialRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $testimonial = Testimonial::find($id);

            if (!$testimonial) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            $data = $this->extractTestimonialData($request);

            // Gọi trait xử lý ảnh
            $data['image'] = $this->handleImageUpdate($request, $testimonial, 'testimonials', $this->imageTestimonial);

            $testimonial->update($data);
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => __('message.update_success'),
                'data' => $data
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
    public function destroy($id)
    {
        try {
            $testimonial = Testimonial::find($id);

            if (!$testimonial) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_fount')
                ], 404);
            }

            $this->handleImageDestroy($testimonial, 'testimonials', $this->imageTestimonial);
            $testimonial->delete();

            return response()->json([
                'status' => 200,
                'message' => __('message.delete_success')
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('message.server_error')
            ], 500);
        }
    }

    /**
     * Method extractTestimonialData
     *
     * @param TestimonialRequest $request
     *
     */
    private function extractTestimonialData(TestimonialRequest $request)
    {
        return $request->only([
            'testimonial',
            'citation',
            'image',
            'status',
            'designation'
        ]);
    }
}
