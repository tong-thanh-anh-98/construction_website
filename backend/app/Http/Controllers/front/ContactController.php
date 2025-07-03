<?php

namespace App\Http\Controllers\front;

use App\Mail\ContactEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\ContactRequest;

class ContactController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactRequest $request)
    {
        try {
            $mailData = [
                'name'      => $request->name,
                'email'      => $request->email,
                'phone'      => $request->phone,
                'subject'      => $request->subject,
                'message'      => $request->message,
                'locale' => app()->getLocale(),
            ];

            Mail::to('role@admin.com')->send(new ContactEmail($mailData));

            return response()->json([
                'status'    => 201,
                'message'   => __('message.contact_thank_you')
            ], 201);
        } catch (\Throwable $e) {
            Log::error('List errors: ' . $e->getMessage());

            return response()->json([
                'status'    => 500,
                'message'   => __('message.server_error')
            ], 500);
        }
    }
}
