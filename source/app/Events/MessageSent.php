<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Message id
     *
     * @var Id
     */
    public $id;

    /**
     * User that sent the message
     *
     * @var user_id
     */
    public $user_id;

    /**
     * User name
     *
     * @var User
     */
    public $user;

    /**
     * Message details
     *
     * @var Message
     */
    public $message;

    /**
     * Message creation date
     *
     * @var created
     */
    public $created;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($id, $user_id, $user, $message, $created)
    {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->user = $user;
        $this->message = $message;
        $this->created = $created;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return [config('broadcasting.connections.pusher.options.defaultChannel')];
    }
    
    public function broadcastAs()
    {
        return 'message_event';
    }
}
