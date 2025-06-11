<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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
                    'message' => 'Validation failed.',
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
                        'message' => 'Admin authentication successfully.',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Either Email/Password is incorrect.',
                    ], 422);
                }
            }
        } catch (\Exception $e) {
            // Log unexpected errors
            Log::error('Authentication error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Something went wrong during authentication.',
            ], 500);
        }
    }

    public function logout()
    {
        $user = User::find((Auth::user()->id));
        $user->tokens()->delete();

        return response()->json([
            'status' => 200,
            'message' => 'You logout successfully.',
        ], 200);
    }
}
