import React, {Component} from 'react';

import { randName } from './../Helpers/Rand'

import Background from './Background'
import AvatarBox from './AvatarBox';
import ChatBox from './ChatBox';
import ChatLogs from './ChatLogs';

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

                <Background />
                <AvatarBox id={this.id} name={this.name} />
                <ChatLogs id={this.id} name={this.name} />
                <ChatBox id={this.id} name={this.name} />
            
            </div>
        )
    }
}
