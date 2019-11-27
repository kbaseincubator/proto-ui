import React, { Component } from 'react';
//import SignIn from './signIn';

// Parent page component for the dashboard page
export class Unautherized extends Component {

  render() {
    return (
      <section className="ph4 mt3">
        <h1>Singed out</h1>
        <p>
          <a href="/">Return home</a>
        </p>
        {/* <SignIn /> */}
      </section>
    );
  }
}