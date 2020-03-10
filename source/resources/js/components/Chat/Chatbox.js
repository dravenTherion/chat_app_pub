import React, {Component} from 'react';
import axios from 'axios';

import './../../../sass/ChatBox.scss'

import SendIcon from '@material-ui/icons/Send';

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

        this.validateMessage = this.validateMessage.bind(this);
    }
    
    /** HANDLE CHAT INPUT CHANGE **/
    
    handleTextChange(event){
        
        if (event.keyCode === 13)
        {
            if(!event.shiftKey)                
                this.sendMessage(this.state.text);
        }
        else 
            this.setState({ text: event.target.value });
        
    }
    
    /** SEND CHAT MESSAGE **/
    
    sendMessage(message){

        if (!this.state.ready || !this.validateMessage(message))
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

    /** VALIDATE MESSAGE LENGTH **/

    validateMessage(message) {
        return message.trim().length > 0;
    }
    
    render(){
    
        return(

            <div id="ChatBox">
                <div className="Chatbox__wrapper">
                    <textarea

                        value = {this.state.text}
                        placeholder = "Type your message here..."
                        className = "ChatBox__textbox"
                        onChange = {this.handleTextChange}
                        onKeyDown = {this.handleTextChange}
                        maxLength = "250"
                        disabled = {!this.state.ready}

                        ref={(element)=>{this.textInput = element;}}

                    ></textarea>
                </div>
                <div className={'Chatbox__send' + (!this.state.ready || !this.validateMessage(this.state.text) ? ' disabled' : '')} onClick={(event) => { this.sendMessage(this.state.text); }}>
                    <SendIcon className="icon" style={{fontSize: 30}}/>
                </div>
            </div>

        )
        
    }
    
}
