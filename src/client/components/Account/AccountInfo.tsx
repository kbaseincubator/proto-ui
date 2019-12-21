import React, { Component } from 'react';

// components
import { Button } from '../generic/Button';

// util
import { getToken } from '../../utils/auth';

interface AuthProvidorId {
  provusername: string | undefined;
  provider: string | undefined;
  id: string | undefined;
}

interface Props {
  username: string | undefined;
  email: string | undefined;
  accountCreated: number | undefined;
  lastSignin: number | undefined;
  idents: Array<AuthProvidorId> | undefined;
}

export class AccountInfo extends Component<Props, any> {
  created: Date = new Date();
  lastSign: Date = new Date();
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  async unlink(id: string | undefined) {
    if (id) {
      console.log(id);
      const url = window._env.kbase_endpoint + '/auth/me/unlink/' + id;
      let token = getToken();
      if (token) {
        const header = { authorization: token };
        const response = await fetch(url, {
          method: 'POST',
          headers: header,
        });
        console.log(response);
      } else {
        throw new Error('Tried to modify account info without a token.');
      }
    }
  }

  render() {
    this.created = new Date(this.props.accountCreated!);
    this.lastSign = new Date(this.props.lastSignin!);
    console.log(this.props, this.created, this.lastSign);
    return (
      <div className="ma4">
        <p>Username: {this.props.username}</p>
        <p>email: {this.props.email}</p>
        <p>Account created: {this.created.toString()}</p>
        <p>Last signin time: {this.lastSign.toString()}</p>
        <div>
          <h2>linked accounts</h2>
          {this.props?.idents?.map((ident: AuthProvidorId) => {
            return (
              <div key={ident.provider} style={{ display: 'flex' }}>
                <p>
                  {ident.provider}: {ident.provusername}
                </p>
                <Button
                  innerText="unlink"
                  backgoundColor="red"
                  onClick={event => this.unlink(ident.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
