<?php

use App\Http\Controllers\EventsController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PresenceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::resource('/events', EventsController::class)->where(['id' => '[0-9]+']);
Route::resource('/participants', ParticipantController::class);
Route::resource('/presence', PresenceController::class);