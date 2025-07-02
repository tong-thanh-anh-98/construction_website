<?php

namespace App\Http\Controllers\admin;

use App\Models\Member;
use App\Services\ImageUploadService;
use App\Traits\HandlesImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;

class MemberController extends Controller
{
    use HandlesImage;

    protected $imageMember;

    public function __construct(ImageUploadService $imageMember)
    {
        $this->imageMember = $imageMember;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $members = Member::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'        => 200,
                'message'       => __('message.success'),
                'member'        => $members
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List error: ' . $e->getMessage());

            return response()->json([
                'status'        => 500,
                'message'       => __('message.server_error')
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MemberRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractMemberData($request);
            $member = Member::create($data);

            // call trait upload image
            $this->handleImageStore($request, $member, 'members', $this->imageMember);

            DB::commit();

            return response()->json([
                'status'        => 201,
                'message'       => __('message.create_success'),
                'member'          => $member
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('List error: ' . $e->getMessage());

            return response()->json([
                'status'        => 500,
                'message'       => __('message.server_error')
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $member = Member::find($id);

            if (!$member) {
                return response()->json([
                    'status'        => 404,
                    'message'       => __('message.not_found')
                ]);
            }

            return response()->json([
                'status'        => 200,
                'message'       => __('message.success'),
                'member'        => $member
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.server_error'),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MemberRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $member = Member::find($id);

            if (!$member) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            $data = $this->extractMemberData($request);

            // Gọi trait xử lý ảnh
            $data['image'] = $this->handleImageUpdate($request, $member, 'members', $this->imageMember);

            $member->update($data);
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => __('message.update_success'),
                'member' => $member
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message' => __('message.server_error'),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $member = Member::find($id);

            if (!$member) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_fount')
                ], 404);
            }

            $this->handleImageDestroy($member, 'members', $this->imageMember);
            $member->delete();

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

    private function extractMemberData(MemberRequest $request)
    {
        return $request->only([
            'name',
            'image',
            'job_title',
            'linkedin_url',
            'status'
        ]);
    }
}
