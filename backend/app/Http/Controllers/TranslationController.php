<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class TranslationController extends Controller
{
    public function getTranslations($locale)
    {
        try {
            App::setLocale($locale);

            $langPath = resource_path("lang/{$locale}.json");

            if (!File::exists($langPath)) {
                return response()->json(['error' => 'Language file not found'], 404);
            }

            $content = File::get($langPath);

            $translations = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => 'Invalid JSON format in lang file'], 500);
            }

            return response()->json($translations);
        } catch (Exception $e) {
            Log::error('Translation error: ' . $e->getMessage());

            return response()->json([
                'error' => 'Unable to load translations',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
