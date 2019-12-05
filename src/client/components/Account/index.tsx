import React, { Component } from 'react';
import { getUsername } from '../../utils/auth';
import { AccuntNav } from './navigation';
import { ProfilePlainText, ProfileEdit } from '../Profile';
import { fetchProfileAPI } from '../../utils/userInfo';
import { DeveloperTokens } from './DeveloperTokens';
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
  }
  synced?: { gravatarHash?: string; }
  userdata?: Userdata
}

interface Props { }

interface State {
  profileLoading: LoadingStates
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
  constructor(props: Props) {
    super(props);

    this.state = {
      profileLoading: LoadingStates.none,
      pathname: undefined,
      user: undefined,
      profile: undefined
    };
    this.navOnClick = this.navOnClick.bind(this);
    this.loadComponent = this.loadComponent.bind(this);
  }
  componentDidMount() {
    getUsername(authUsername => {
      if(authUsername !== null){
        this.setState({ authUsername });
        this.getProfile(authUsername);
      }
    });
    let pathname = window.location.pathname.replace('/newnav/account', '');
    console.log('window.location.pathname', window.location.pathname, pathname)
    this.setState({ pathname });
  }

  componentDidUpdate() {
    let pathname = window.location.pathname.replace('/newnav/account', '');
    console.log('window.location.pathname updated', window.location.pathname, pathname);
    if (pathname !== this.state.pathname) {
      this.setState({ pathname });
    }
  }

  async getProfile(profileID: string) {
    this.setState({ profileLoading: LoadingStates.fetching });
    let res = await fetchProfileAPI(profileID);
    console.log(res)
    // let profileData = await fetchProfileAPI('amarukawa');
    if (typeof res !== 'undefined' && res.status === 200) {
      this.setState({ profile: res.response.profile, user: res.response.user, profileLoading: LoadingStates.success });
    } else {
      this.setState({ profileLoading: LoadingStates.error, profileFetchErrorText: res.statusText });
    }
  }

  // Set gravatarURL
  gravatarSrc(): string | undefined {
    const userdata = this.state.profile && this.state.profile.userdata;
    const synced = this.state.profile && this.state.profile.synced;
    console.log(this.state.profile, userdata, synced)
    if (userdata && synced) {
      
      if (userdata.avatarOption === 'silhoutte' || !synced.gravatarHash) {
        return window._env.url_prefix + 'static/images/nouserpic.png';
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
    return true
  }

  navOnClick(): void {
    if (event && event.target) {
      let ele = event.target as HTMLElement;
      let pathname = ele!.closest('li')!.getAttribute('data-hl-nav')!;
      this.setState({ pathname });
      let url = window._env.url_prefix + 'newnav/account/' + pathname;
      console.log(url);
      window.history.pushState(null, '', url);
    }
  }

  loadComponent(): JSX.Element {
    const pathname = this.state.pathname;
    let path: string = '';
    console.log("loadComponent", this.state.profileLoading)
    if (typeof pathname === 'string') { path = pathname.replace('/', ''), console.log(path) }
    switch (path) {
      case 'profile':
      case '':
        if (this.isAuthUser() === true) {
          return <ProfileEdit
            loading={this.state.profileLoading}
            profile={this.state.profile}
            user={this.state.user}
            gravatarSrc={this.gravatarSrc()}
          />;
        } else {
          return <ProfilePlainText
            loading={this.state.profileLoading}
            profile={this.state.profile}
            user={this.state.user}
            gravatarSrc={this.gravatarSrc()}
          />;
        }
      case 'account':
        return (
          <DeveloperTokens />
        );
      case 'linked_accounts':
        return (
          <DeveloperTokens />
        );
      case 'developer_tokens':
        return (
          <DeveloperTokens />
        );
      case 'running_jobs':
        return (
          <DeveloperTokens />
        );
      case 'usage_agreeements':
        return <DeveloperTokens />
      default:
        return < NotFoundPage />
    }
  }

  render() {
    return (
      <>
        <AccuntNav navOnClick={this.navOnClick} />
        {this.loadComponent()}
      </>
    );
  }
}
