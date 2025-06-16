<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\ServiceController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\front\ServiceController as FrontServiceController;

Route::post('authenticate', [AuthenticationController::class, 'authenticate']);

// Group admin
Route::prefix('admin')->name('admin.')->middleware('auth:sanctum')->group(function () {
    Route::get('logout', [AuthenticationController::class, 'logout'])->name('logout');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // admin service route
    Route::apiResource('services', ServiceController::class);

    // admin temp image
    Route::post('save-temp-images', [TempImageController::class, 'store']);
});

// Group front
Route::prefix('front')->name('front.')->group(function () {
    Route::get('get-services', [FrontServiceController::class, 'index'])->name('index');
    Route::get('get-latest-services', [FrontServiceController::class, 'latestServices'])->name('latestServices');
});
