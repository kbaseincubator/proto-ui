import React, { Component } from 'react';

interface Props {
  href?: string;
  linkText?: string;
}

interface State {}

// Parent page component for the dashboard page
export class NotFoundPage extends Component<Props, State> {
  render() {
    const href = this.props.href || '/';
    const linkText = this.props.linkText || 'Return home';
    return (
      <section className="mt4 tc">
        <img src="/static/images/flapjack.png" alt="Confused Flapjack 404" />
        <h1>Page Not Found</h1>
        <p>
          <a href={href}>{linkText}</a>
        </p>
      </section>
    );
  }
}
