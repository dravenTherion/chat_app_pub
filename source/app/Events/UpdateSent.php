<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UpdateSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * User that sent the message
     *
     * @var Id
     */
    public $id;

    /**
     * User coords
     *
     * @var x, y
     */
    public $x;
    public $y;

    /**
     * User target coords
     *
     * @var tx, ty
     */
    public $tx;
    public $ty;

    /**
     * Response flag
     *
     * @var tx, ty
     */
    public $isResponse;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($id, $x, $y, $tx, $ty)
    {
        $this->id = $id;
        $this->x = $x;
        $this->y = $y;
        $this->tx = $tx;
        $this->ty = $ty;
        $this->isResponse = true;
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
        return 'update_event';
    }
}
