import React, { Component } from 'react';
//import SignIn from '../signin/signIn';

// Parent page component for the dashboard page
export class Unauthorized extends Component {

  render() {
    return (
      <section className="ph4 mt3">
        <h1>Signed out</h1>
        <p>
          <a href="/">Return home</a>
        </p>
        {/* <SignIn /> */}
      </section>
    );
  }
}