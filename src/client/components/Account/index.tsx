import React, { Component } from 'react';

// utilities
import { fetchProfileAPI, Auth2Me } from '../../utils/userInfo';
import { DeveloperTokens } from './DeveloperTokens';

import { History, UnregisterCallback } from 'history';
import { Router, Route } from '../generic/Router';

// components
import { AccuntNav } from './navigation';
import { ProfilePlainText, ProfileEdit } from '../Profile';
import { AccountInfo } from './AccountInfo';

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

interface Auth2Profile {
  created: number;
  customroles: Array<string>;
  display: string;
  email: string;
  idents: Array<{
    provusername: 'string';
    provider: 'OrcID or Google or Globus';
    id: 'string';
  }>;
  lastlogin: number;
  local: boolean;
  policyids: Array<{ id: 'string'; agreedon: number }>;
  roles: Array<any>;
  user: string;
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
  auth2Profile?: Auth2Profile;
}

export class Account extends Component<Props, State> {
  // URL location history
  history: History;
  // Callback to stop listening to history
  historyUnlisten?: UnregisterCallback;

  currentPathname: string = '';

  constructor(props: Props) {
    super(props);
    this.history = props.history;
    this.state = {
      profileLoading: LoadingStates.none,
      user: undefined,
      profile: undefined,
      auth2Profile: undefined,
    };
    this.navOnClick = this.navOnClick.bind(this);
  }
  componentDidMount() {
    this.currentPathname = window.location.pathname;

    Auth2Me().then(data => {
      console.log(data, 'data');
      this.setState({
        authUsername: data?.user,
        auth2Profile: data,
      });
    });
    this.historyUnlisten = this.history.listen((location, action) => {});
  }

  componentDidUpdate() {
    // if the profile is not loaded yet
    // check URL to decide which profile to fetch
    if (this.state.authUsername && this.state.profileLoading === 'none') {
      const regex = RegExp('/profile/(.+)');
      let profileID: string = '';

      if (regex.test(this.currentPathname)) {
        let index = this.currentPathname.indexOf('profile/');
        profileID = this.currentPathname.slice(index + 'profile/'.length);
        this.getProfile(profileID);
      } else {
        this.getProfile(this.state.authUsername);
      }
    }
  }

  componentWillUnmount() {
    // Stop listening to the location history
    if (this.historyUnlisten) {
      this.historyUnlisten();
    }
  }

  isAuthUserID() {
    this.currentPathname = window.location.pathname;
    if (this.currentPathname.includes('profile')) {
      let index = this.currentPathname.indexOf('profile');
      let profileID = this.currentPathname.slice(index + 'profile'.length);
    }
  }

  /**
   * fetch profile from a usrID
   * @param profileID
   */
  async getProfile(profileID: string) {
    this.setState({ profileLoading: LoadingStates.fetching });
    let res = await fetchProfileAPI(profileID);
    if (typeof res !== 'undefined' && res.status === 200) {
      this.setState({
        profile: res.response?.profile,
        user: res.response?.user,
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
                displayName={this.state.auth2Profile?.display}
                email={this.state.auth2Profile?.email}
                gravatarSrc={this.gravatarSrc()}
              />
            </Route>
            <Route path="/account">
              <AccountInfo
                username={this.state.authUsername}
                email={this.state.auth2Profile?.email}
                accountCreated={this.state.auth2Profile?.created}
                lastSignin={this.state.auth2Profile?.lastlogin}
                idents={this.state.auth2Profile?.idents}
              />
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
