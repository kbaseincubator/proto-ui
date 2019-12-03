import React, { Component } from 'react';

// Parent page component for the dashboard page
export class NotFoundPage extends Component {
  
  render() {
    return (
      <section className="ph4 mt3">
        <h1>Page Not Found</h1>
        <img src={window.location.origin+ '/static/images/flapjack.png'} />
        <p>
          <a href="/">Return home</a>
        </p>
      </section>
    );
  }
}
