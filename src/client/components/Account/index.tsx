import React, { Component } from 'react';
import { getUsername } from '../../utils/auth';
import { fetchProfileAPI } from '../../utils/userInfo';
import { DeveloperTokens } from './DeveloperTokens';

import { History, UnregisterCallback } from 'history';


import { AccuntNav } from './navigation';
import { Router, Route } from '../generic/Router';
import { ProfilePlainText, ProfileEdit } from '../Profile';

import { NotFoundPage } from '../not_found/index';
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
  pathname?: string;
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
  historyUnlisten?: UnregisterCallback; constructor(props: Props) {
    super(props);
    this.history = props.history;
    this.state = {
      profileLoading: LoadingStates.none,
      pathname: undefined,
      user: undefined,
      profile: undefined,
    };
    this.navOnClick = this.navOnClick.bind(this);
    // this.loadComponent = this.loadComponent.bind(this);
  }
  componentDidMount() {
    getUsername(authUsername => {
      if (authUsername !== null) {
        this.setState({ authUsername });
        this.getProfile(authUsername);
      }
    });
    this.historyUnlisten = this.history.listen((location, action) => {
      let pathname = window.location.pathname.replace('/newnav/account', '');
      console.log('window.location.pathname', window.location.pathname, pathname);
      this.setState({ pathname });
    });
  }

  componentDidUpdate() {
    // let pathname = window.location.pathname.replace('/newnav/account', '');
    // console.log(
    //   'window.location.pathname updated',
    //   window.location.pathname,
    //   pathname
    // );
    // if (pathname !== this.state.pathname) {
    //   this.setState({ pathname });
    // }
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
    // let profileData = await fetchProfileAPI('amarukawa');
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
    const userdata = this.state.profile && this.state.profile.userdata;
    const synced = this.state.profile && this.state.profile.synced;
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

  isAuthUser(): boolean {
    // return true or false depending on if the search param is auth uer or not
    return true;
  }

  navOnClick(): void {
    if (event && event.target) {
      let ele = event.target as HTMLElement;
      let pathname = ele!.closest('li')!.getAttribute('data-hl-nav')!;
      this.setState({ pathname });
      // let url = window.location.origin + 'newnav/account/' + pathname;
      console.log(pathname);
      // window.history.pushState(null, '', url);
      this.history.push(pathname)
    }
  }


  render() {
    return (
      <Router history={this.history}>
        <Route path={/.*/} >
          <AccuntNav navOnClick={this.navOnClick} />
          <Router history={this.history}>
            <Route path="/">
              <ProfileEdit
                loading={this.state.profileLoading}
                profile={this.state.profile}
                user={this.state.user}
                gravatarSrc={this.gravatarSrc()}
              />
            </Route>
            <Route path="/profile">
              <ProfileEdit
                loading={this.state.profileLoading}
                profile={this.state.profile}
                user={this.state.user}
                gravatarSrc={this.gravatarSrc()}
              />
            </Route>
            <Route path="/account">
                <DeveloperTokens text="tyaccountaccountpes" />
            </Route>
          </Router>
        </Route>
      </Router>
    );
  }
}
