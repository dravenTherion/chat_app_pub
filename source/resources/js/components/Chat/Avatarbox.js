import React, {Component} from 'react';

import axios from 'axios';
import Pusher from 'pusher-js';

import gsap from "gsap";

import Config from './../Settings/Config';

import { randRange } from './../Helpers/Rand';
import Renderer from './../Helpers/Renderer';

import './../../../sass/Avatarbox.scss';

import spritesheet from './../../../img/spritesheet.png';


export default class Avatarbox extends React.Component{
    
    constructor(props) {
        super(props);
        
        this.state = {

            activeClients: [],
            
            status: 'loading',
            
            errors: [],
        
        };
        
        // Time when update was requested
        this.tsUpdateRequest;
        
        this.Avatar = null;
        
        this.width = 0;
        this.height = 0;
        
        this.clients = [];
        
        this.canvas = null;
        this.ctx = null;
        
        this.handleResize = this.handleResize.bind(this);
        this.handleClick = this.handleClick. bind(this);
        
        this.addClient = this.addClient.bind(this);
        this.addReference = this.addReference.bind(this);
        
        this.handleJoin = this.handleJoin.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        
        this.handleMessage = this.handleMessage.bind(this);
        
    }
        
    componentDidMount() { 
        
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        
        
        var pusher = new Pusher(Config.pusherKey, {
            cluster: Config.pusherCluster,
            forceTLS: Config.forceTLS
        });

        
        var channel = pusher.subscribe(Config.defaultChannel ? Config.defaultChannel : 'chat_channel');
        
        channel.bind('join_event', this.handleJoin);
        channel.bind('leave_event', this.handleLeave);        
        channel.bind('update_event', this.handleUpdate);        
        
        channel.bind('message_event', this.handleMessage);                

        const payload = {
            id: this.props.id,
            user: this.props.name,
            x: Math.floor(randRange(this.width * 0.1, this.width * 0.9)),
            y: Math.floor(randRange(this.height * 0.25, this.height * 0.75)),
            avatar: Math.floor(randRange(0, 1))
        }

        
        axios.post('api/client_join', payload)
        .catch(error=>{
            this.setState({
                errors: error.response.data.errors
            });
        });
        
        window.addEventListener('load', (e)=>{
            //window.addEventListener('beforeunload', this.handleLeave);
            window.addEventListener('unload', (e)=>{
                const data = 'id=' + this.props.id;
                navigator.sendBeacon('api/client_leave?' + data);
            });
        });    
        
        
        Renderer.init(this.canvas, this.clients, spritesheet);
        
        gsap.ticker.add(Renderer.renderCanvas);
        
    }

    componentWillUnmount() { 
        window.removeEventListener('resize', this.handleResize);
    }
    
    
    /** HANDLE WINDOW RESIZE **/
    
    handleResize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    

    /** HANDLE MESSAGE **/
    
    handleMessage(data){
        
        const newActiveClients = [...this.state.activeClients];
        const activeClientFound = newActiveClients.find((u)=>{ return data.id === u.id;});
        
        
        if(activeClientFound !== undefined)
        {
            activeClientFound.message = data.message;
            
            this.setState({activeClients: newActiveClients});
                
            const clientFound = this.clients.find((u)=>{ return data.id === u.id;});
            
            gsap.killTweensOf(clientFound.dom.querySelector('.Avatarbox__message__bubble'));
            gsap.fromTo(clientFound.dom.querySelector('.Avatarbox__message__bubble'), 0.45, {scale: 0, autoAlpha: 0}, {scale: 1, autoAlpha: 1, ease: 'back.out(1)', repeat: 1, yoyo: true, repeatDelay: 20});
        }
    
    }
    
    
    /** HANDLE CLICK **/
    
    handleClick(e){
        
        if(this.Avatar === null || (Date.now() - this.tsUpdateRequest) / 1000 < 0.5)
            return;
        
        const payload = {
            id: this.props.id,
            x: this.Avatar.x,
            y: this.Avatar.y,
            tx: e.pageX,
            ty: e.pageY,
            trigger: true,
        }
        
        axios.post('api/send_update', payload);
        
        this.tsUpdateRequest = Date.now();
        
        this.handleUpdate(payload);
        
    }
    
    /** HANDLE UPDATE **/
    
    handleUpdate(data){
        
        if(data.isResponse && data.id === this.props.id)
            return;
        
        const clientFound = this.clients.find((u)=>{ return data.id === u.id;}),
              
              speed = 300,
              
              deltaX = data.tx - clientFound.x,     
              deltaY = data.ty - clientFound.y,
              dist  = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)),
              
              time  = dist / speed;
        
        
        if(clientFound !== undefined)
        {
            clientFound.direction = data.tx < data.x ? -1 : 1;
            clientFound.currentFrameSet = 1;
            
            gsap.killTweensOf(clientFound);
            gsap.killTweensOf(clientFound.dom);

            gsap.to(clientFound, time, {x: data.tx, y: data.ty, ease: 'linear'});
            gsap.to(clientFound.dom, time, {x: data.tx, y: data.ty, ease: 'linear', 
                                            onComplete: (t)=>{
                                                
                                                t.currentFrameSet = 0;
                                                
                                                if(t.id === this.props.id)
                                                {
                                                    const payload = {
                                                        id: this.props.id,
                                                        x: this.Avatar.x,
                                                        y: this.Avatar.y,
                                                        tx: this.Avatar.x,
                                                        ty: this.Avatar.y,
                                                        trigger: false,
                                                    }

                                                    axios.post('api/send_update', payload);
                                                }
                                                
                                            }, onCompleteParams: [clientFound]});
        }
        
    }

        
    /** HANDLE CLIENT JOIN **/
    
    handleJoin(data){
        
        axios.get('api/client_all')
        .then(response=>{
            
            const data = response.data;
            
            for(let ctr=0; ctr < data.length; ctr++)
                this.addClient(data[ctr]);
        
        });          
    
    }
    
    
    /** ADD NEW CLIENT **/
    
    addClient(user){
        
        const userFound = this.state.activeClients.find((u)=>{ return user.id === u.id;});
            
        if(userFound === undefined)
            this.setState({activeClients: [...this.state.activeClients, {id: user.id, user: user.user, message: '', avatar: user.avatar}]});
        
        
        const clientFound = this.clients.find((u)=>{ return user.id === u.id;});
        
        if(clientFound !== undefined)
        {
            gsap.set(clientFound.dom, {x: user.x, y: user.y});
            gsap.set(clientFound, {x: user.x, y: user.y});
        }
    }
    
    
    /** ADD CLIENT DOM REFERENCE **/
    
    addReference(client, element){

        const frameWidth = 95,
              frameHeight = 150;

        const id = client.id;
        const found = this.clients.find((u)=>{ return id === u.id;});
            
        if(found === undefined)
        {
            const avatar = {
                id: id, 
                dom: element, 
                x: 0, 
                y: 0,
                frames: [
                    new Renderer.frame((client.avatar * frameWidth * 2), 0, frameWidth, frameHeight, 30, Math.floor(randRange(0, 29))),
                    new Renderer.frame((client.avatar * frameWidth * 2 + frameWidth), 0, frameWidth, frameHeight, 20, 0)
                ],
                currentFrameSet: 0,
                direction: 1
            };
            
            if(id === this.props.id)
                this.Avatar = avatar;
            
            this.clients = [...this.clients, avatar];
            Renderer.setList(this.clients);
        }
    }
    
    
    /** HANDLE CLIENT LEAVE **/
    
    handleLeave(data){
        
        const newActiveClients = this.state.activeClients.filter((user)=>{return user.id !== data.id;});
        
        this.setState({activeClients: newActiveClients});
                
        this.clients = this.clients.filter((u)=>{return u.id !== data.id;});
        
        Renderer.setList(this.clients);
            
        //console.log('left', data);
        
    }
    
    
    /** RENDER CANVAS **/
    
    render(){
        return(
            <div id="Avatarbox" className={this.state.status} onClick={this.handleClick}>
                <canvas width={this.width} height={this.height} className="Avatarbox__canvas" ref={canvas=>this.canvas=canvas}>
                </canvas>
                <ul>
                    {this.state.activeClients.map(client=>{
                        
                        return(                            
                            <div className="Avatarbox__message" key={client.id} ref={div=>this.addReference(client, div)}>
            
                                <p className={'Avatarbox__message__bubble' + (client.id === this.props.id ? ' own' : '')}>
                                    <span className="Avatarbox_bubble__inner">
                                        {client.message}
                                    </span>
                                </p>                
                                
                                <p className={'Avatarbox__message__name' + (client.id === this.props.id ? ' own' : '')}>{client.user}</p>

                            </div>
                        )
            
                    })}
                </ul>
            </div>
        )
    }
    
}
