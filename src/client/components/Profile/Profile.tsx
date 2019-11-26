import React, { Component } from 'react';

import { buildResearchInterests } from './fragments';
import { fetchProfileAPI } from '../../utils/userInfo';

interface Props {
  authUsername?: string | null;
}

enum LoadingStates {
  fetching,
  success,
  error,
  none,
}

interface State {
  profileID: string;
  edit: boolean;
  loading: LoadingStates | null;
  profileData: {};
}

export class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      profileID: '',
      edit: false,
      loading: LoadingStates.none,
      profileData: {},
    };

    this.getProfile = this.getProfile.bind(this);
  }
  componentDidMount() {
    console.log('authUsername', this.props)
    let profileID:string = ''; // profile ID that the page will be fetching
    let searchParam = window.location.search.slice(1);
    let authUsername = this.props.authUsername;
    if(authUsername){ // check if user is logged in
      if(searchParam){
        if(authUsername !== searchParam){
          profileID = searchParam
        }
      }
      this.setState({ edit: true });
      profileID = authUsername;
      this.getProfile(profileID);
    } else {
      // need to log in
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {

  }

  async getProfile(profileID: string) {
    this.setState({ loading: LoadingStates.fetching });
    let profileData = await fetchProfileAPI(profileID);
    // let profileData = await fetchProfileAPI('amarukawa');
    if (typeof profileData !== 'undefined' && profileData.status === 200) {
      this.setState({ loading: LoadingStates.success, profileData: profileData.response});
    } else {
      this.setState({ loading: LoadingStates.error, profileData});
    }
  }

  render() {
    if (this.state.loading === LoadingStates.success) {
      return <div>'profile loaded'</div>;
    } else if (this.state.loading === LoadingStates.fetching) {
      return <div>fetching</div>;
    } else if (this.state.loading === LoadingStates.error) {
      return <div>opps {this.state.profileData.status} {this.state.profileData.statusText}</div>
    } else {
      return <div>so empty</div>;
    }
  }
}
