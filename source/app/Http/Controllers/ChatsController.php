<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Events\MessageSent;
use App\Events\UpdateSent;

use App\Events\ClientJoined;
use App\Events\ClientLeft;

use App\ChatUser;

use Pusher\Pusher;

class ChatsController extends Controller
{
    public function sendMessage(Request $request)
    {
        event(new MessageSent($request->input('id'), $request->input('user'), $request->input('message')));
        
        return 'message sent!';
    } 

    public function sendUpdate(Request $request)
    {
        ChatUser::where('id', $request->input('id'))    
                ->update([
                            'x' => $request->input('x'),
                            'y' => $request->input('y'),
                            'tx' => $request->input('tx'),
                            'ty' => $request->input('ty'),
                        ]);
        
        if($request->input('trigger') == true)
        {
        
            event(new UpdateSent(
                                 $request->input('id'), 
                                 $request->input('x'), 
                                 $request->input('y'), 
                                 $request->input('tx'), 
                                 $request->input('ty')
                                ));

        }
        
        return 'status updated!';
    } 
    
    
    public function clientJoin(Request $request)
    {
        $user = ChatUser::firstOrCreate([
            'id' => $request->input('id'), 
            'user' => $request->input('user'), 
            'x' => $request->input('x'), 
            'y' => $request->input('y'),
            'tx' => $request->input('x'), 
            'ty' => $request->input('y'),
            'status' => 0,
        ]);
        
        event(new ClientJoined($request->input('id'), $request->input('user')));
        
        return 'client joined!';
    }
    
    
    public function clientAll()
    {
        $users = ChatUser::project(['_id'=>0])->get(['id', 'user', 'x', 'y', 'tx', 'ty']);
        
        return $users;
    }

    public function clientClear()
    {
        $users = ChatUser::truncate();
        
        return 'room cleared!';
    }
    
    
    public function clientLeave(Request $request)
    {
        ChatUser::where('id', $request->input('id'))->delete();
        
        event(new ClientLeft($request->input('id')));
        
        return 'client left!';
    }
    /**/
}
