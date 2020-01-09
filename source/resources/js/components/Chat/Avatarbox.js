import React, {Component} from 'react';

import axios from 'axios';
import Pusher from 'pusher-js';

import gsap from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

import Config from './../Settings/Config';

import Rand from './../Helpers/Rand';
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
        
        
        gsap.registerPlugin(CSSRulePlugin);
    
    }
        
    componentDidMount() { 
        
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        
        
        var pusher = new Pusher(Config.pusherKey, {
            cluster: Config.pusherCluster,
            forceTLS: Config.forceTLS
        });

        
        var channel = pusher.subscribe('chat_channel');
        
        channel.bind('join_event', this.handleJoin);
        channel.bind('leave_event', this.handleLeave);        
        channel.bind('update_event', this.handleUpdate);        
        
        channel.bind('message_event', this.handleMessage);                

        const payload = {
            id: this.props.id,
            user: this.props.name,
            x: Math.floor(Rand.range(this.width * 0.1, this.width * 0.9)),
            y: Math.floor(Rand.range(this.height * 0.25, this.height * 0.75))
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
        
        
        const clientFound = this.clients.find((u)=>{ return data.id === u.id;});
        
        const adjFactor = 1;
        
        const speed = 250,
              
              //deltaX = data.tx - (data.isResponse !== undefined ? data.x : clientFound.x),     
              deltaX = data.tx - clientFound.x,//(data.isResponse !== undefined ? data.x : clientFound.x),     
              //deltaY = data.ty - (data.isResponse !== undefined ? data.y : clientFound.y),
              deltaY = data.ty - clientFound.y,//(data.isResponse !== undefined ? data.y : clientFound.y),
              dist  = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)),
              
              time  = dist / speed,
              deltaTime = (Date.now() - this.tsUpdateRequest) / 1000,
              
              distXAtDeltaTime = data.x + ((data.id === this.props.id) ? (deltaTime / time) * deltaX * adjFactor : 0),
              distYAtDeltaTime = data.y + ((data.id === this.props.id) ? (deltaTime / time) * deltaY * adjFactor : 0);
        
        if(clientFound !== undefined)
        {
            clientFound.direction = data.tx < data.x ? -1 : 1;
            clientFound.currentFrameSet = 1;
            
            gsap.killTweensOf(clientFound);
            gsap.killTweensOf(clientFound.dom);
            
            gsap.set(clientFound, {x: distXAtDeltaTime, y: distYAtDeltaTime});
            gsap.set(clientFound.dom, {x: distXAtDeltaTime, y: distYAtDeltaTime});

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
            this.setState({activeClients: [...this.state.activeClients, {id: user.id, user: user.user, message: ''}]});
        
        
        const clientFound = this.clients.find((u)=>{ return user.id === u.id;});
        
        if(clientFound !== undefined)
        {
            gsap.set(clientFound.dom, {x: user.x, y: user.y});
            gsap.set(clientFound, {x: user.x, y: user.y});
        }
    }
    
    
    /** ADD CLIENT DOM REFERENCE **/
    
    addReference(id, element){
        
        const found = this.clients.find((u)=>{ return id === u.id;});
            
        if(found === undefined)
        {
            const avatar = {
                id: id, 
                dom:element, 
                x: 0, 
                y: 0,
                frames: [ 
                    new Renderer.frame(0, 0, 95, 150, 30, Math.floor(Rand.range(0, 29))),
                    new Renderer.frame(95, 0, 95, 150, 20, Math.floor(Rand.range(0, 19)))
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
                    {this.state.activeClients.map(user=>{
                        
                        return(                            
                            <div className="Avatarbox__message" key={user.id} ref={div=>this.addReference(user.id, div)}>
            
                                <p className={'Avatarbox__message__bubble' + (user.id === this.props.id ? ' own' : '')}>
                                    <span className="Avatarbox_bubble__inner">
                                        {user.message}
                                    </span>
                                </p>                
                                
                                <p className={'Avatarbox__message__name' + (user.id === this.props.id ? ' own' : '')}>{user.user}</p>

                            </div>
                        )
            
                    })}
                </ul>
            </div>
        )
    }
    
}
