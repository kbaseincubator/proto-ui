import React, { Component } from 'react';
import { getUsername } from '../../utils/auth';
import { fetchProfileAPI } from '../../utils/userInfo';

interface Props {
  // profile data
  // organizations
  // narratives
}

interface State {
  username: string;
}

export class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
    };
    this.getProfile = this.getProfile.bind(this);
  }
  componentDidMount() {
    getUsername(username => {
      if (typeof username === 'string') {
        window._env.username = username;
        window._env.username = username;
        this.setState({username})
      }
    });
    console.log(this.state)
  }

  componentDidUpdate(prevState:State) {
   console.log(prevState, this.state) 
  }

  async getProfile() {
    let profileID: string = '';
    if(window.location.search){
      profileID = window.location.search.slice(1);
    }
  }

  render() {
    return <div>"WORKING?"</div>;
  }
}
