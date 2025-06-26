<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{
    public function getAllArticles()
    {
        try {
            $articles = Article::where('status', 1)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status'        => 200,
                'message'       => __('message.success'),
                'data'          => $articles
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

    public function latestArticles(Request $request)
    {
        try {
            $articles = Article::orderBy('created_at', 'desc')
                ->where('status', 1)
                ->limit($request->limit)
                ->get();

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $articles
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
