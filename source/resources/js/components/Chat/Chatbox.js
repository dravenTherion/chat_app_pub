import React, {Component} from 'react';
import axios from 'axios';

import './../../../sass/Chatbox.scss'

export default class Chatbox extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            text: '',
            chats: [],
            errors: [],
        };
        
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    
    handleTextChange(e){
        
        if (e.keyCode === 13 && this.state.text.trim().length > 0)
        {
            
            this.sendMessage(this.state.text);
        }
        else 
        {            
            this.setState({ text: e.target.value });
        }
    }
    
    sendMessage(message){
        
        const payload = {
            id: this.props.id,
            user: this.props.name,
            message: message
        };
            
        axios.post('api/send_message', payload)
             .then(response=>{
                // clear form input
                this.setState({
                text: ''
                });
             })
             .catch(error=>{
                this.setState({
                    errors: error.response.data.errors
                })
             });
        
    }
    
    render(){
    
        return(

            <div id="Chatbox">
            <input
                type="text"
                value={this.state.text}
                placeholder="type message here..."
                className="Chatbox__textbox"
                onChange={this.handleTextChange}
                onKeyDown={this.handleTextChange}
                maxLength="250"
            />
            </div>

        )
        
    }
    
}