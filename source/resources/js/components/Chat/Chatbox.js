import React, {Component} from 'react';
import axios from 'axios';

import './../../../sass/ChatBox.scss'

export default class ChatBox extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            text: '',
            chats: [],
            errors: [],
            ready: true
        };
        
        this.textInput = null;
        
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    
    /** HANDLE CHAT INPUT CHANGE **/
    
    handleTextChange(event){
        
        if (event.keyCode === 13 && this.state.text.trim().length > 0)
            this.sendMessage(this.state.text);
        else 
            this.setState({ text: event.target.value });
        
    }
    
    /** SEND CHAT MESSAGE **/
    
    sendMessage(message){
        
        if(!this.state.ready)
            return;
            
        const payload = {
            id: this.props.id,
            user: this.props.name,
            message: message
        };
            
        axios.post('api/send_message', payload)
             .then(response=>{
                
                // clear form input
                this.setState({
                    text: '',
                    ready: true
                });
            
                this.textInput.focus();

             })
             .catch(error=>{
                this.setState({
                    
                    errors: error.response.data.errors,
                    ready: true
                })
             });
        
        
        this.setState({ready: false});
        
    }
    
    render(){
    
        return(

            <div id="ChatBox">
                <input
                    type = "text"
                    value = {this.state.text}
                    placeholder = "Type your message here..."
                    className = "ChatBox__textbox"
                    onChange = {this.handleTextChange}
                    onKeyDown = {this.handleTextChange}
                    maxLength = "250"
                    disabled = {!this.state.ready}
            
                    ref={(element)=>{this.textInput = element;}}
                />
            </div>

        )
        
    }
    
}