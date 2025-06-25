<?php

namespace App\Http\Controllers\admin;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use App\Http\Requests\ArticleRequest;

class ArticleController extends Controller
{
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

            if ($request->has('imageId')) {
                $fileName = $this->imageArticle->moveTempToPermanent('articles', $article->id, $request->imageId);
                $article->update(['image' => $fileName]);
            }

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

            if ($request->filled('imageId') && is_numeric($request->imageId)) {
                // TH1: Có ảnh mới, chuyển từ temp sang permanent
                $tempImageId = (int)$request->imageId;
                $fileName = $this->imageArticle->moveTempToPermanent('articles', $article->id, $tempImageId);

                if ($article->image) {
                    $this->imageArticle->deletePermanentImage('articles', $article->image);
                }

                $data['image'] = $fileName;
            } elseif ($request->boolean('removeImage') && !$request->filled('imageId')) {
                // TH2: Chỉ xóa ảnh nếu không có ảnh mới đi kèm
                if ($article->image) {
                    $this->imageArticle->deletePermanentImage('articles', $article->image);
                }

                $data['image'] = null;
            }

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

            if ($article->image) {
                $this->imageArticle->deletePermanentImage('articles', $article->image);
            }

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
