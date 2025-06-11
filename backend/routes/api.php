<?php

use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\AuthenticationController;
use Illuminate\Support\Facades\Route;

Route::post('authenticate', [AuthenticationController::class, 'authenticate']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    // protected route
    Route::get('logout', [AuthenticationController::class, 'logout']);
    Route::get('dashboard', [DashboardController::class, 'index']);
});
