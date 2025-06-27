<?php

namespace App\Http\Controllers\admin;

use App\Models\Article;
use App\Traits\HandlesImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use App\Http\Requests\ArticleRequest;

class ArticleController extends Controller
{
    use HandlesImage;

    protected $imageArticle;

    public function __construct(ImageUploadService $imageArticle)
    {
        $this->imageArticle = $imageArticle;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $articles = Article::orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'    => 200,
                'message'   => __('message.success'),
                'data'      => $articles
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
    public function store(ArticleRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $this->extractArticleData($request);
            $article = Article::create($data);

            // Gọi trait tải ảnh lên
            $this->handleImageStore($request, $article, 'articles', $this->imageArticle);

            DB::commit();

            return response()->json([
                'status'    => 201,
                'message' => __('message.create_success'),
                'data'      => $article
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
            $article = Article::find($id);

            if (!$article) {
                return response()->json([
                    'status'    => 404,
                    'message' => __('message.not_found'),
                ], 404);
            }

            return response()->json([
                'status'  => 200,
                'message' => __('message.success'),
                'data'    => $article
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
    public function update(ArticleRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $article = Article::find($id);

            if (!$article) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            $data = $this->extractArticleData($request);

            // Gọi trait xóa ảnh
            $data['image'] = $this->handleImageUpdate($request, $article, 'articles', $this->imageArticle);

            $article->update($data);
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
            $article = Article::find($id);

            if (!$article) {
                return response()->json([
                    'status' => 404,
                    'message' => __('message.not_found')
                ], 404);
            }

            // Gọi trait để xóa ảnh khi xóa article
            $this->handleImageDestroy($article, 'articles', $this->imageArticle);
            $article->delete();

            return response()->json([
                'status' => 200,
                'message' => __('message.delete_success')
            ], 200);
        } catch (\Throwable $e) {
            Log::error('List errors: ' . $e->getMessage());

            return response()->json([
                'status'  => 500,
                'message' => __('message.server_error'),
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Method extractArticleData
     *
     * @param ArticleRequest $request
     *
     */
    private function extractArticleData(ArticleRequest $request)
    {
        return $request->only([
            'title',
            'slug',
            'author',
            'content',
            'image',
            'status'
        ]);
    }
}
