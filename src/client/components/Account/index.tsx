import React, { Component } from 'react';
import { getUsername } from '../../utils/auth';
import {Profile} from '../Profile/Profile';

interface Props {}

interface State {
  username?: string | null;
  authUsername?: string | null;
  pathname?: string | null;
}

export class Account extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: null,
      authUsername: null,
      pathname: null
    };
  }
  componentDidMount() {
    getUsername(authUsername => {
      this.setState({ authUsername: authUsername });
    });
    let pathname = window.location.pathname.replace('/account/', '');
    this.setState({pathname})
  }

  componentDidUpdate() {}

  render() {
    switch(this.state.pathname){
      case 'profile':
        return <Profile authUsername={this.state.authUsername}/>;
      case 'account':
        return <div><h1>Account Component</h1></div>;
      case 'linked_accounts':
        return <div><h1>linked_accounts</h1></div>;
      case 'developer_tokens':
        return <div><h1>developer_tokens</h1></div>;
      case 'running_jobs':
        return <div><h1>running_jobs</h1></div>;
      case 'usage_agreeements':
        return <div>usage_agreeements</div>;
      default:
        return <Profile authUsername={this.state.authUsername}/>;
    } 
  }
}
