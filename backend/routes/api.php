<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\admin\ArticleController;
use App\Http\Controllers\admin\ProjectController;
use App\Http\Controllers\admin\ServiceController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\front\ProjectController as FrontProjectController;
use App\Http\Controllers\front\ServiceController as FrontServiceController;

Route::get('/translations/{locale}', [TranslationController::class, 'getTranslations'])->name('getTranslations');
Route::post('authenticate', [AuthenticationController::class, 'authenticate'])->name('authenticate');

// Group admin
Route::prefix('admin')->name('admin.')->middleware('auth:sanctum')->group(function () {
    Route::get('logout', [AuthenticationController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::apiResource('services', ServiceController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('articles', ArticleController::class);

    Route::post('save-temp-images', [TempImageController::class, 'store'])->name('store');
    Route::get('get-temp-images/{id}', [TempImageController::class, 'show'])->name('show');
    Route::delete('remove-temp-images/{id}', [TempImageController::class, 'removeTempImage'])->name('removeTempImage');
});

// Group front
Route::prefix('front')->name('front.')->group(function () {
    Route::get('get-services', [FrontServiceController::class, 'index'])->name('index');
    Route::get('get-latest-services', [FrontServiceController::class, 'latestServices'])->name('latestServices');

    Route::get('get-projects', [FrontProjectController::class, 'index'])->name('index');
    Route::get('get-latest-projects', [FrontProjectController::class, 'latestProjects'])->name('latestProjects');
});
