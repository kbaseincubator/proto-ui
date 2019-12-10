import React, { Component } from 'react';
import { getUsername } from '../../utils/auth';
import { fetchProfileAPI } from '../../utils/userInfo';
import { DeveloperTokens } from './DeveloperTokens';

import { History, UnregisterCallback } from 'history';

import { AccuntNav } from './navigation';
import { Router, Route } from '../generic/Router';
import { ProfilePlainText, ProfileEdit } from '../Profile';

export enum LoadingStates {
  fetching = 'fetching',
  success = 'success',
  error = 'error',
  none = 'none',
}
export interface Userdata {
  affiliations?: Array<{}>;
  avatarOption?: string;
  city?: string;
  country?: string;
  department?: string;
  fundingSource?: string;
  gravatarDefault?: string;
  jobTitle?: string;
  jobTitleOther?: string;
  orgainzation?: string;
  researchInterests?: Array<string>;
  researchInterestOther?: string;
  researchStatement?: string;
  state?: string;
}

export interface Profile {
  metadata: {
    createdBy: string;
    created: string;
  };
  synced?: { gravatarHash?: string };
  userdata?: Userdata;
}

interface Props {
  history: History;
}

interface State {
  profileLoading: LoadingStates;
  authUsername?: string;
  user?: {
    realname?: string;
    username?: string;
  };
  profile?: Profile;
  profileFetchErrorText?: string;
  profileFetchStatus?: number;
}

export class Account extends Component<Props, State> {
  // URL location history
  history: History;
  // Callback to stop listening to history
  historyUnlisten?: UnregisterCallback;
  constructor(props: Props) {
    super(props);
    this.history = props.history;
    this.state = {
      profileLoading: LoadingStates.none,
      user: undefined,
      profile: undefined,
    };
    this.navOnClick = this.navOnClick.bind(this);
  }
  componentDidMount() {
    console.log('componentDidMount');

    getUsername(authUsername => {
      if (authUsername !== null) {
        this.setState({ authUsername });
      }
    });
    this.historyUnlisten = this.history.listen((location, action) => {
      console.log('location.pathname', location.pathname);
    });
  }

  componentDidUpdate() {
    console.log('account index componentDidUpdate', this.state);
    if (this.state.authUsername && this.state.profileLoading === 'none') {
      this.getProfile(this.state.authUsername);
    }
  }

  componentWillUnmount() {
    // Stop listening to the location history
    if (this.historyUnlisten) {
      this.historyUnlisten();
    }
  }

  async getProfile(profileID: string) {
    this.setState({ profileLoading: LoadingStates.fetching });
    let res = await fetchProfileAPI(profileID);
    console.log(res);
    if (typeof res !== 'undefined' && res.status === 200) {
      this.setState({
        profile: res.response.profile,
        user: res.response.user,
        profileLoading: LoadingStates.success,
      });
    } else {
      this.setState({
        profileLoading: LoadingStates.error,
        profileFetchErrorText: res.statusText,
      });
    }
  }

  // Set gravatarURL
  gravatarSrc(): string | undefined {
    const userdata = this.state?.profile?.userdata;
    const synced = this.state.profile?.synced;
    if (userdata && synced) {
      if (userdata.avatarOption === 'silhoutte' || !synced.gravatarHash) {
        return window._env.urlPrefix + 'static/images/nouserpic.png';
      } else if (synced.gravatarHash) {
        return (
          'https://www.gravatar.com/avatar/' +
          synced.gravatarHash +
          '?s=300&amp;r=pg&d=' +
          userdata.gravatarDefault
        );
      }
    }
  }

  navOnClick(): void {
    const location = this.history.location.pathname;
    if (location.includes('profile')) {
      this.history.push('');
    }
    let ele = event!.target as HTMLElement;
    let pathname =
      ele?.closest('li')?.getAttribute('data-hl-nav') ||
      ele?.getAttribute('data-hl-nav');
    if (pathname === 'profile') {
      pathname = pathname + '/' + this.state.user?.username;
    }
    if (pathname) {
      this.history.push(pathname);
    }
  }

  render() {
    return (
      <Router history={this.history}>
        <Route path={/.*/}>
          <AccuntNav navOnClick={this.navOnClick} />
          <Router history={this.history}>
            <Route path="/">
              <ProfilePlainText
                redirect={this.navOnClick}
                loading={this.state.profileLoading}
                profile={this.state.profile}
                user={this.state.user}
                gravatarSrc={this.gravatarSrc()}
              />
            </Route>
            <Route path={/^\/profile/}>
              <ProfileEdit
                loading={this.state.profileLoading}
                profile={this.state.profile}
                user={this.state.user}
                gravatarSrc={this.gravatarSrc()}
              />
            </Route>
            <Route path="/account">
              <DeveloperTokens text="account" />
            </Route>
            <Route path="/developer_tokens">
              <DeveloperTokens text="developer_tokens" />
            </Route>
            <Route path="/running_jobs">
              <DeveloperTokens text="running_jobs" />
            </Route>
            <Route path="/usage_agreeements">
              <DeveloperTokens text="usage_agreeements" />
            </Route>
          </Router>
        </Route>
      </Router>
    );
  }
}
