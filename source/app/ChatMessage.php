<?php

namespace App;

//use Illuminate\Database\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class ChatMessage extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'user_messages';
    
    protected $fillable = [
        'user_id', 'user', 'message'
    ];
}
