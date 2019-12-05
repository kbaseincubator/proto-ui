import React, { Component } from 'react';

const SIGNIN_LINK = window._env.narrative + '/#login';

// Parent page component for the dashboard page
export class Unauthorized extends Component {
  render() {
    return (
      <section className="mt4">
        <h1>Signed out</h1>
        <p>
          <a href={SIGNIN_LINK}>Sign in or sign up</a>
        </p>
        {/* <SignIn /> */}
      </section>
    );
  }
}
