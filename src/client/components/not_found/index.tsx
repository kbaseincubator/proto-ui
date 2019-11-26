import React, { Component } from 'react';

// Parent page component for the dashboard page
export class NotFoundPage extends Component {
  render() {
    return (
      <section className="ph4 mt3">
        <h1>Page Not Found</h1>
        <p>TODO put something fun here</p>
        <p>
          <a href="/">Return home</a>
        </p>
      </section>
    );
  }
}
