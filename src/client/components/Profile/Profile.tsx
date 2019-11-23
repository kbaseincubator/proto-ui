import React, { Component } from 'react';
import { getUsername } from '../../utils/auth';
import { fetchProfileAPI } from '../../utils/userInfo';

interface Props {
  authUsername?: string | null;
}

interface State {
  username: string;
}

export class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
    }

    this.getProfile = this.getProfile.bind(this);
  }
  componentDidMount() {
    if(this.props.authUsername){
      if (window.location.search) {
        let profileID = window.location.search.slice(1);
        this.setState({ username: profileID });
      } else {
        this.setState({ username: this.props.authUsername });
      }
    }
    console.log(this.state)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
   console.log(this.state, prevState)
  }

  async getProfile() {

  }

  render() {
    return <div>"WORKING?"</div>;
  }
}
