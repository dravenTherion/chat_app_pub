<?php

namespace App;

//use Illuminate\Database\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class ChatUser extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'active_users';
    
    protected $fillable = [
        'id', 'user', 'x', 'y', 'tx', 'ty', 'avatar'
    ];
}
