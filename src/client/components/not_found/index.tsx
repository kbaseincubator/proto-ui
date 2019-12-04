import React, { Component } from 'react';

export class NotFoundPage extends Component {
  render() {
    return (
      <section className="ph4 mt3">
        <h1>Page Not Found</h1>
        <img src='/images/flapjack.png' alt='KBase logo' />
        <p>
          <a href="/">Return home</a>
        </p>
      </section>
    );
  }
}
