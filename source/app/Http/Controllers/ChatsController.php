<?php

namespace App\Http\Controllers;

use MongoDB\BSON\UTCDateTime;

use Illuminate\Http\Request;

use App\Events\MessageSent;
use App\Events\UpdateSent;

use App\Events\ClientJoined;
use App\Events\ClientLeft;

use App\ChatUser;
use App\ChatMessage;

use Pusher\Pusher;

class ChatsController extends Controller
{
    /**
     * Send chat message
     *
     */
    
    public function sendMessage(Request $request)
    {
        $message = ChatMessage::create([
            'user_id' => $request->input('id'), 
            'user' => $request->input('user'), 
            'message' => $request->input('message')
        ]);
        
        event(new MessageSent($message->id, $message->user_id, $message->user, $message->message, $message->created_at));
        
        return 'message sent!';
    }

    
    /**
     * Fetch messages based on page
     *
     */
    
    public function fetchMessages(Request $request)
    {
        $skip = $request->input('offset') ? intval($request->input('offset')) : 0;
        $take = $request->input('limit') ? intval($request->input('limit')) : 10;
        
        $count = ChatMessage::count();
        
        $message = ChatMessage::orderBy('created_at','desc')
                              ->skip($skip)
                              ->take($take)
                              ->get(['id', 'user_id', 'user', 'message', 'created_at']);

        
        for($ctr=0; $ctr < count($message); $ctr++)
        {
            $date = new \MongoDB\BSON\UTCDateTime($message[$ctr]->created_at);
            
            $message[$ctr]['created'] = $date->toDateTime()->format(DATE_ATOM);
        }

        $data['data'] = $message;
        
        $data['count'] = $count;
        $data['to'] = $skip + $take;
        
        return $data;
    }
    
    
    /**
     * Send the user's updated data
     *
     */

    public function sendUpdate(Request $request)
    {
        $user = ChatUser::where('id', $request->input('id'))    
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
    
    
    /**
     * Record the new user in the active users' collection and then update the channel
     *
     */
    
    public function clientJoin(Request $request)
    {
        $user = ChatUser::firstOrCreate([
            'id' => $request->input('id'), 
            'user' => $request->input('user'), 
            'x' => $request->input('x'), 
            'y' => $request->input('y'),
            'tx' => $request->input('x'), 
            'ty' => $request->input('y'),
            'avatar' => $request->input('avatar'),
        ]);

        event(new ClientJoined($user->id, $user->user));
        
        return 'client joined!';
    }
    
    
    /**
     * Fetch all clients/users in the channel
     *
     */
    
    public function clientAll()
    {
        $users = ChatUser::project(['_id'=>0])
                          ->get(['id', 'user', 'x', 'y', 'tx', 'ty', 'avatar']);
        
        return $users;
    }
    

    /**
     * Delete the useer from the collection and then notify the channel
     *
     */
    
    public function clientLeave(Request $request)
    {
        $user = ChatUser::where('id', $request->input('id'))->delete();
        
        event(new ClientLeft($request->input('id')));
        
        return 'client left!';
    }
    
}
