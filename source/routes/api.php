<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
*/


Route::get('messages', 'ChatsController@fetchMessages');
Route::post('send_message', 'ChatsController@sendMessage');
Route::post('send_update', 'ChatsController@sendUpdate');

Route::post('client_join', 'ChatsController@clientJoin');
Route::post('client_leave', 'ChatsController@clientLeave');

Route::get('client_all', 'ChatsController@clientAll');