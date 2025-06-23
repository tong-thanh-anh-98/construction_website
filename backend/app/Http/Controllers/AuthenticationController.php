<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthenticationController extends Controller
{
    public function authenticate(Request $request)
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => __('auth.validation_failed'),
                    'errors' => $validator->errors(),
                ], 422);
            } else {
                $credentials = [
                    'email' => $request->email,
                    'password' => $request->password
                ];

                if (Auth::attempt($credentials)) {
                    $user = User::find((Auth::user()->id));
                    $token = $user->createToken('token')->plainTextToken;

                    return response()->json([
                        'id' => Auth::user()->id,
                        'token' => $token,
                        'status' => 200,
                        'message' => __('auth.login_success'),
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 422,
                        'message' => __('auth.login_failed'),
                    ], 422);
                }
            }
        } catch (\Exception $e) {
            // Log unexpected errors
            Log::error('Authentication error: ' . $e->getMessage());

            return response()->json([
                'message' => __('auth.server_error'),
            ], 500);
        }
    }

    public function logout()
    {
        try {
            $user = User::find((Auth::user()->id));

            if (!$user) {
                return response()->json([
                    'status' => 401,
                    'message' => __('auth.unauthenticated'),
                ], 401);
            }

            $user->tokens()->delete();

            return response()->json([
                'status' => 200,
                'message' => __('auth.logout_success'),
            ], 200);
        } catch (\Throwable $e) {
            // Log lỗi lại để debug nếu cần
            Log::error('Logout error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => __('auth.logout_failed'),
            ], 500);
        }
    }
}
