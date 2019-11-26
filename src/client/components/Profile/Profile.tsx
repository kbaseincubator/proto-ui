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
    let profileID = window.location.search.slice(1);
    if (this.props.authUsername) {
      if (profileID) {
        this.setState({ profileID });
        return;
      }
      this.setState({ profileID: this.props.authUsername, edit: true });
    } else {
      // you need auth
    }
    console.log(this.state);
    this.getProfile(this.state.profileID);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    console.log(this.state, prevState);
  }

  async getProfile(profileID: string) {
    this.setState({ loading: LoadingStates.fetching });
    let profileData = await fetchProfileAPI('foo');
    if (typeof profileData !== 'undefined' && profileData.status === 200) {
      this.setState({ loading: LoadingStates.success, profileData });
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
