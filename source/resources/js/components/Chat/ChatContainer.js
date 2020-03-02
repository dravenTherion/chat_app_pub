import React, {Component} from 'react';

import { randName } from './../Helpers/Rand'

import Chatbox from './Chatbox';
import Avatarbox from './Avatarbox';

import './../../../sass/ChatContainer.scss';

export default class ChatContainer extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            user: '',
        };
        
        this.name = randName();
        this.id = this.name + '_' + Date.now();
    }
    
    componentDidMount() { 
        
        this.setState({id: this.id, user: this.name});
    
    }
    
    render(){
        return(
            <div id="ChatContainer">
            
                <Avatarbox id={this.id} name={this.name} />
                <Chatbox id={this.id} name={this.name} />
            
            </div>
        )
    }
}
