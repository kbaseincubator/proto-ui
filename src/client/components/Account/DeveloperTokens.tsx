import React, { Component } from 'react';

interface Props{
  text: string
}
export class DeveloperTokens extends Component<Props, any>{
  
  render() {
    return <div>Developer Tokens {this.props.text}</div>;
  }
}
