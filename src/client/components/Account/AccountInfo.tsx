import React, { Component } from 'react';

// components
import { Button } from '../generic/Button';

// util
import { unlink } from '../../utils/userInfo';

interface AuthProvidorId {
  provusername: string;
  provider: string;
  id: string;
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

  render() {
    this.created = new Date(this.props.accountCreated!);
    this.lastSign = new Date(this.props.lastSignin!);
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
                <Button innerText="unlink" backgoundColor="red" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
