import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Header.css';

import { fetchProfileAPI } from '../../utils/userInfo';
import { getUsername } from '../../utils/auth';

interface State {
  dropdownHidden: boolean;
  gravatarHash: string;
  avatarOption: string | undefined;
  gravatarDefault: string | undefined;
  env: string | undefined;
  envIcon: string | undefined;
}

interface Props {
  username: string | null;
  realname: string | null;
}

export class AccountDropdown extends Component<Props, State> {
  bodyCloseHandler: (ev: MouseEvent) => void = () => {};

  constructor(props: Props) {
    super(props);
    this.state = {
      dropdownHidden: true,
      gravatarHash: '',
      avatarOption: undefined,
      gravatarDefault: undefined,
      env: undefined,
      envIcon: undefined,
    };
    this.dropDown = this.dropDown.bind(this);
  }

  componentDidMount() {
    //TODO: AKIYO setUrl_prefix setting the state calling getUserID second time.
    // make change to stop second call
    this.bodyCloseHandler = (ev) => {
      const elm = document.querySelector('.account-dropdown');
      const target = ev.target;
      if (!elm || !target) {
        return;
      }
      if (!elm.contains(ev.target as Node)) {
        this.setState({ dropdownHidden: true });
      }
    }
    document.body.addEventListener('click', this.bodyCloseHandler);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.bodyCloseHandler);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState === this.state) {
      return;
    }
  }

  toggleDropdown() {
    this.setState({ dropdownHidden: !this.state.dropdownHidden });
  }

  /**
   * if open is true, then set dropdown Hidden to false
   * if open is null, taggle dropdown Hidden
   * @param open
   */
  dropDown(open: boolean | null): void {
    if (open === true) {
      this.setState({ dropdownHidden: true });
    } else if (open === false) {
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
      return window._env.url_prefix + 'static/images/nouserpic.png';
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
      <div className='account-dropdown'>
        <button
          className="profile-dropdown flex"
          onClick={event => this.toggleDropdown()}
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
        >
          <li>
            <div className="dib">
              <div>{this.props.realname}</div>
              <div style={{ fontStyle: 'italic' }}>{this.props.username}</div>
            </div>
          </li>
          <hr className="hr-global-header" />
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
    );
  }
}

