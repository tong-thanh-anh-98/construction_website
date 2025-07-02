<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Support\Facades\Log;

class MemberController extends Controller
{
    public function getAllMembers()
    {
        try {
            $members = Member::where('status', 1)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status'        => 200,
                'message'       => __('message.success'),
                'member'        => $members
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
