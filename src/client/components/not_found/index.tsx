import React, { Component } from 'react';

interface Props {
  href?: string;
  linkText?: string;
}

interface State {
}

// Parent page component for the dashboard page
export class NotFoundPage extends Component<Props, State> {
  render() {
    const href = this.props.href || '/';
    const linkText = this.props.linkText || 'Return home';
    return (
      <section className="ph4 mt4">
        <h1>Page Not Found</h1>
        <p>
          <a href={href}>{linkText}</a>
        </p>
      </section>
    );
  }
}
