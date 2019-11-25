import React, { Component } from 'react';

// Components
import { NarrativeList } from './NarrativeList/index';

// Parent page component for the dashboard page
export class Dashboard extends Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <section className="mt4">
        <NarrativeList />
      </section>
    );
  }
}
