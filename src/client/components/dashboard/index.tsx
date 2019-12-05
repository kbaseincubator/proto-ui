import React, { Component } from 'react';
import { History } from 'history';

// Components
import { NarrativeList } from './NarrativeList/index';

interface Props {
  history: History;
}

// Parent page component for the dashboard page
export class Dashboard extends Component<Props, {}> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <section className="mt4 mw8 center">
        <NarrativeList />
      </section>
    );
  }
}
