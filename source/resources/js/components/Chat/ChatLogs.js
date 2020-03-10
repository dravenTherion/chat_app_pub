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
        
        this.currentMessagesCount = 0;
        this.totalMessagesCount = 0;
        this.loading = false;
        
        this.currentScrollHeight = 0;
        this.currentScrollTop = 0; 
        
        this.addReference = this.addReference.bind(this);
        
        this.handleMessage = this.handleMessage.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        
        this.handleScroll = this.handleScroll.bind(this);
        this.setScroll = this.setScroll.bind(this);
        
        this.isCollapsed = this.isCollapsed.bind(this);
    }
    
    componentDidMount(){
        
        this.fetchMessages(this.currentMessages);
        
        const pusher = new Pusher(Config.pusherKey, {
            cluster: Config.pusherCluster,
            forceTLS: Config.forceTLS
        }),
              
        channel = pusher.subscribe(Config.defaultChannel ? Config.defaultChannel : 'chat_channel');
        
        channel.bind('message_event', this.handleMessage);
        
    }
    
    
    /** HANDLE INCOMING MEESAGES **/
    
    handleMessage(data, prepend = false){
    
        const messages = Array.isArray(data) ? (prepend === true ? data : data.reverse()) : [data],
              currentMessages = [...this.state.messages];
        
        this.currentMessagesCount += messages.length;
        this.currentScrollTop = this.container.scrollTop;
        
        
        for(let ctr=0; ctr < messages.length; ctr++){
            
            const message = messages[ctr],
                  messageId = message.id !== undefined ? message.id : message._id,
                  messageSegment = {id: messageId, message: message.message},
                  newMessage = {
                                id: messageId,
                                user_id: message.user_id,
                                user: message.user,
                                message: [messageSegment],
                                created: new Date(message.created)
                            },
                  
                  lastMessage = currentMessages.length ? currentMessages[prepend === true ? 0 : (currentMessages.length-1)] : undefined;
            
            let lastMessageFound = false;
            
            if(lastMessage)
                if(lastMessage.user_id === newMessage.user_id)
                {
                    this.insertMessageTo(lastMessage.message, messageSegment, prepend);
                    lastMessage.created = newMessage.created;

                    lastMessageFound = true;
                }
        
            if (!lastMessageFound)
                this.insertMessageTo(currentMessages, newMessage, prepend);

        }
                
        
        this.setState({messages: currentMessages}, (e)=>{
            
            const currentScrollHeight = this.currentScrollHeight,
                newScrollHeight = this.container.scrollHeight,

                latestMessage = messages[messages.length - 1];


            let scrollTop;

            if (latestMessage)
                if (latestMessage.user_id === this.props.id)
                    scrollTop = newScrollHeight - this.container.clientHeight;
            else
                scrollTop = newScrollHeight - currentScrollHeight + this.currentScrollTop;

            
            this.currentScrollHeight = newScrollHeight;
            
            this.setScroll(scrollTop);
        
        });
        
    }

    insertMessageTo(list, message, prepend){

        if (prepend === true)
            list.unshift(message);
        else
            list.push(message);

    }
    
    
    /** FETCH PREVIOUS MESSAGES **/
    
    fetchMessages(offset = 0, prepend = false){
        
        if(this.loading)
            return;
        
        this.loading = true;
        
        axios.get('api/messages?offset=' + offset)
        .then(response=>{
            
            const data = response.data,
                  messages = data.data;
            
            this.loading = false;
            
            this.totalMessagesCount = data.count;

            if(messages.length)
                this.handleMessage(messages, prepend);        
            
        });
        
    }
    
    
    /** HANDLE CHAT LOGS TOGGLE **/
    
    handleToggle(event){
        
        this.setState({collapsed: this.state.collapsed ? false : true}, this.setScroll);
    
    }
    
    
    /** HANDLE CHAT LOGS SCROLL */
    
    handleScroll(event){
        
        if(!this.loading)
            if(this.container.scrollTop === 0)
            {
                this.fetchMessages(this.currentMessagesCount, true);
            }
        
    }
    
    
    /** RESET SCROLL TO THE LATEST ITEM **/
    
    setScroll(scroll){
        
        const scrollValue = (Number.isNaN(scroll) || scroll === undefined) ? this.currentScrollHeight - this.container.clientHeight : scroll;
        
        this.container.scrollTop = scrollValue;
        
    }
    
    
    /** ADD DOM REFERENCES **/
    
    addReference(element){
        
        this.container = element;
        
    }
    
    
    /** HELPER METHOD THAT RETURNS STATUS CLASS BASED ON COLLAPSED STATE **/
    
    isCollapsed(){
        
        return this.state.collapsed ? ' collapsed' : '';
        
    }
    
    
    /** RENDER CHAT LOGS **/
        
    render(){
    
        return(

            <div id="ChatLogs" className={this.isCollapsed()}>
                
                <div className={'ChatLogs__pullout' + this.isCollapsed()} onClick={this.handleToggle}>
                    <span className="inner">
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </span>
                </div>
                
                <div className={'ChatLogs__container' + this.isCollapsed()} ref={(element)=>this.addReference(element)} onScroll={this.handleScroll}>    
                    {this.state.messages.map((message)=>{

                        return(
                            <div className={'ChatLogs__message' + (message.user_id == this.props.id ? ' own' : '')} key={message.id}>
                                <div className="user_id">
                                    <strong className="name">{message.user}</strong>
                                    <i className="id">{'<' + message.user_id.replace(message.user + '_', '') + '/>'}</i>
                                </div>
                                <p className="body">                                    
                                
                                    {message.message.map((message)=>{
                                     
                                        return(
                                            <span className="segment" key={message.id}>{message.message}</span>
                                        )
                                     
                                    })}

                                </p>
                                <div className="date">
                                    {message.created.toLocaleDateString() + ' ' + message.created.toLocaleTimeString()}
                                </div>
                            </div>
                        )    

                    })}
                </div>
            </div>

        )
        
    }
    
}
