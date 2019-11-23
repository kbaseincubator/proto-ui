import React, { Component } from 'react';
import { getUsername } from '../../utils/auth';
import { fetchProfileAPI } from '../../utils/userInfo';

interface Props {
  authUsername?: string | null;
}

interface State {
  profileID: string;
  edit: boolean;
}

export class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      profileID: '',
      edit: false,
    }

    this.getProfile = this.getProfile.bind(this);
  }
  componentDidMount() {
    let profileID = window.location.search.slice(1);
    if(this.props.authUsername){
      if(profileID){
        this.setState({profileID})
        return
      }
      this.setState({profileID:this.props.authUsername})
    } else {
      // you need auth
    }
    console.log(this.state)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
   console.log(this.state, prevState)
  }

  async getProfile(profileID:string) {

  }

  render() {
    return <div>"Profile?"</div>;
  }
}
