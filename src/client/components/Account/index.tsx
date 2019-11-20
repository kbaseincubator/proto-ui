import React, { Component } from 'react';
import {getUsername} from '../../utils/auth';
import {fetchProfile} from '../../redux/actions';
interface Props {

}

interface State {
  username: string | null;
  authUsername: string | undefined;
}

export class Account extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: undefined,
      authUsername: undefined
    };
  }
  componentDidMount(){
    getUsername((authUsername) => {
      this.setState({authUsername:authUsername})
    });
    if(window.location.search){
      let user = window.location.search.slice(1);
      this.setState({username: user})
    }
    if(this.state.username === this.state.authUsername){
      fetchProfile(this.state.username);
    } else {
      fetchProfile(this.state.authUsername);
    }
  }

  componentDidUpdate(){
  }

  

  render() {
    return (
      <div>
        "WORKING?"
      </div>
    );
  }
}