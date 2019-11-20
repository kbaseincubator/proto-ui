import React, { Component } from 'react';
import './Header.css';

import { fetchProfileAPI } from '../../utils/userInfo';
import { getUsername } from '../../utils/auth';

interface State {
  dropdownHidden: boolean;
  gravatarHash: string | undefined;
  avatarOption: string | undefined;
  gravatarDefault: string | undefined;
  env: string | undefined;
  envIcon: string | undefined;
  username: string | undefined;
  realname: string | undefined;
}

interface Props {
  headerTitle: string;
}

export class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dropdownHidden: true,
      gravatarHash: undefined,
      avatarOption: undefined,
      gravatarDefault: undefined,
      env: undefined,
      envIcon: undefined,
      username: undefined,
      realname: undefined,
    };
    this.getUserID = this.getUserID.bind(this);
    this.setUrl_prefix = this.setUrl_prefix.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.dropDown = this.dropDown.bind(this);
  }

  componentDidMount() {
    this.setUrl_prefix();
    this.getUserID();
    this.getUserInfo();
  }

  getUserID() {
    getUsername((username: string) => {
      window._env.username = username;
    });
  }

  setUrl_prefix() {
    let prefix: string;
    let icon: string;
    switch (window._env.url_prefix) {
      case '':
      case 'https:ci.kbase.us':
        prefix = 'CI';
        icon = 'fa fa-2x fa-flask';
        break;
      case 'https:appdev.kbase.us':
        prefix = 'APPDEV';
        icon = 'fa fa-2x fa-wrench';
        break;
      default:
        prefix = 'CI';
    }
    this.setState({ env: prefix, envIcon: icon });
  }

  async getUserInfo() {
    let res = await fetchProfileAPI();
    let avatarOption = res.profile.userdata.avatarOption;
    let gravatarHash = res.profile.synced.gravatarHash;
    let gravatarDefault = res.profile.userdata.gravatarDefault;
    let username = res.user.username;
    let realname = res.user.realname;
    this.setState({
      avatarOption,
      gravatarHash,
      gravatarDefault,
      realname,
      username,
    });
  }
  /**
   * if open is true, then set dropdown Hidden to false
   * if open is null, taggle dropdown Hidden
   * @param open
   */
  dropDown(open: boolean | null): void {
    if (open) {
      this.setState({ dropdownHidden: true });
    } else if (!open) {
      this.setState({ dropdownHidden: false });
    } else {
      if (this.state.dropdownHidden) {
        this.setState({ dropdownHidden: false });
      } else {
        this.setState({ dropdownHidden: true });
      }
    }
  }

  // Set gravatarURL
  gravaterSrc() {
    if (this.state.avatarOption === 'silhoutte' || !this.state.gravatarHash) {
      // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={nouserpic} />;
      return window._env.url_prefix + '/static/images/nouserpic.png';
    } else if (this.state.gravatarHash) {
      return (
        'https://www.gravatar.com/avatar/' +
        this.state.gravatarHash +
        '?s=300&amp;r=pg&d=' +
        this.state.gravatarDefault
      );
      // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={gravaterSrc} />;
    }
  }
  render() {
    return (
      <>
        <h1 className="roboto-header">{this.props.headerTitle}</h1>
        <div
          className="flex top-0 right-0 absolute h-100"
          style={{ marginRight: '19px' }}
        >
          <div
            className="tc"
            style={{
              border: '1px silver solid',
              padding: '3px',
              margin: '2px',
              height: '58px',
              minWidth: '34px',
              alignSelf: 'center',
              marginRight: '24px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                paddingBottom: '4px',
              }}
            >
              {this.state.env}
            </div>
            <i
              className={this.state.envIcon}
              style={{ color: '#2196F3', fontSize: '28px' }}
            ></i>
          </div>
          <button
            className="profile-dropdown flex"
            onClick={event => this.dropDown(null)}
            onBlur={event => this.dropDown(false)}
          >
            <img
              style={{ maxWidth: '40px' }}
              alt="avatar"
              src={this.gravaterSrc()}
            />
            <i
              className="fa fa-caret-down"
              style={{ marginLeft: '5px', marginTop: '14px', fontSize: '13px' }}
            ></i>
          </button>
          <ul
            className="dropdown-menu tc right-0"
            style={{ left: 'auto' }}
            role="menu"
            hidden={this.state.dropdownHidden}
            onFocus={event => this.dropDown(true)}
            onBlur={event => this.dropDown(false)}
          >
            <li>
              <div className="dib">
                <div>{this.state.realname}</div>
                <div style={{ fontStyle: 'italic' }}>{this.state.username}</div>
              </div>
            </li>
            <hr className="hr-header" />
            <li>
              <a>
                <div className="dib" style={{ width: '34px' }}>
                  <i
                    className="fa fa-sign-out"
                    style={{ fontSize: '150%', marginRight: '10px' }}
                  ></i>
                </div>
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  }
}
