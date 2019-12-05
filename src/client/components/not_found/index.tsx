import React, { Component } from 'react';

export class NotFoundPage extends Component {
  render() {
    return (
      <section className="mt3 tc">
        <h1>Page Not Found</h1>
        <img src="/static/images/flapjack.png" alt="Confused Flapjack 404" />
        <p>
          <a href="/">Return home</a>
        </p>
      </section>
    );
  }
}
