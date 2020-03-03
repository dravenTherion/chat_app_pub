import React, {Component} from 'react';

import axios from 'axios';
import Pusher from 'pusher-js';

import Config from './../Settings/Config';

import './../../../sass/ChatLogs.scss'

export default class ChatLogs extends React.Component{
    
    constructor(props){
        super(props);        
        this.state = {
            collapsed: true,
            messages: []        
        };
        
        
        this.container = null;
        
        this.addReference = this.addReference.bind(this);
        
        this.handleMessage = this.handleMessage.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        
        this.resetScroll = this.resetScroll.bind(this);
    }
    
    componentDidMount(){
        
        this.fetchChats();
        
        const pusher = new Pusher(Config.pusherKey, {
            cluster: Config.pusherCluster,
            forceTLS: Config.forceTLS
        }),
              
        channel = pusher.subscribe(Config.defaultChannel ? Config.defaultChannel : 'chat_channel');
        
        channel.bind('message_event', this.handleMessage);
        
    }
    
    fetchChats(){
        
        axios.get('api/messages')
        .then(response=>{
            const data = response.data;
            this.handleMessage(data.data.reverse());        
        });
        
    }
    
    addReference(element){
        
        this.container = element;
        
    }
    
    handleMessage(data){
    
        const messages = Array.isArray(data) ? data : [data],
              currentMessages = [...this.state.messages]; 
              
        for(let ctr=0; ctr < messages.length; ctr++){
            
            const message = messages[ctr],
                  messageId = message.id !== undefined ? message.id : message._id,
                  messageSegment = {id: messageId, message: message.message},
                  newMessage = {
                                id: messageId,
                                user_id: message.user_id,
                                user: message.user,
                                message: [messageSegment]
                            },
                  
                  lastMessage = currentMessages.length ? currentMessages[currentMessages.length-1] : undefined;
            
            let lastMessageFound = false;
            
            if(lastMessage)
                if(lastMessage.user_id === newMessage.user_id)
                {   
                    lastMessage.message.push(messageSegment);               
                    lastMessageFound = true;
                }
            
            
            if(!lastMessageFound)
                currentMessages.push(newMessage);
        }
        
        this.setState({messages: currentMessages}, this.resetScroll);
        
    }
    
    handleToggle(event){
        
        this.setState({collapsed: this.state.collapsed ? false : true}, this.resetScroll);
    
    }
    
    resetScroll(){
        
        this.container.scrollTop = this.container.scrollHeight - this.container.clientHeight;
        
    }
        
    render(){
    
        return(

            <div id="ChatLogs" className={this.state.collapsed ? ' collapsed' : ''}>
                
                <div className={'ChatLogs__pullout' + (this.state.collapsed ? ' collapsed' : '')} onClick={this.handleToggle}>
                    <span className="inner"></span>
                </div>
                
                <div className="ChatLogs__container" ref={(element)=>this.addReference(element)}>    
                    {this.state.messages.map((message)=>{

                        return(
                            <div className={'ChatLogs__message' + (message.user_id == this.props.id ? ' own' : '')} key={message.id}>
                                <div className='ChatLogs__message__inner'>
                                    <div className="user_id">
                                        <strong className="name">{message.user}</strong>
                                        <i className="id">{'{' + message.user_id.replace(message.user + '_', '') + '}'}</i>
                                    </div>
                                    <p className="body">
                                        
                                        
                                        {message.message.map((message)=>{
                                         
                                            return(
                                                <span className="segment" key={message.id}>{message.message}</span>
                                            )
                                         
                                        })}


                                    </p>
                                </div>
                            </div>
                        )    

                    })}
                </div>
            </div>

        )
        
    }
    
}