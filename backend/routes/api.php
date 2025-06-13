<?php

use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\ServiceController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\AuthenticationController;
use Illuminate\Support\Facades\Route;

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

});
