import React, { Component } from 'react';

import TextInput from '../generic/TextInput';
import NumInput from '../generic/NumInput';
import ProfilePlainText from './ProfilePlainText';
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
  fullname: string;
}

export class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      profileID: '',
      edit: false,
      loading: LoadingStates.none,
      profileData: {},
      fullname: ''
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
    let res = await fetchProfileAPI(profileID);
    console.log(res)
    // let profileData = await fetchProfileAPI('amarukawa');
    if (typeof res !== 'undefined' && res.status === 200) {
      this.setState({ loading: LoadingStates.success, profileData: res.response.profile, fullname: res.response.user.realname});
    } else {
      this.setState({ loading: LoadingStates.error, profileData:res});
    }
  }
  // Set gravatarURL
  gravatarSrc() {
    const profile = this.state.profileData;
    if (profile.userdata.avatarOption === 'silhoutte' || !profile.synced.gravatarHash) {
      return window._env.url_prefix + 'static/images/nouserpic.png';
    } else if (profile.synced.gravatarHash) {
      return (
        'https://www.gravatar.com/avatar/' +
        profile.synced.gravatarHash +
        '?s=300&amp;r=pg&d=' +
        profile.userdata.gravatarDefault
      );
    }
    return '';
  }

  render() {
    if (this.state.loading === LoadingStates.success) {
      return <div style={{display: 'flex' padding: '2rem'}}><ProfilePlainText profileId={this.state.profileID} profileRealName={this.state.fullname} profileData={this.state.profileData} gravatarSrc={this.gravatarSrc()}/></div>;
    } else if (this.state.loading === LoadingStates.fetching) {
      return <div>fetching</div>;
    } else if (this.state.loading === LoadingStates.error) {
      return <div>opps {this.state.profileData.status} {this.state.profileData.statusText}</div>
    } else {
      return <div>so empty</div>;
    }
  }
}
