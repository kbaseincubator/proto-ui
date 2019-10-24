import React, {Component} from 'react';

// Components
import {NarrativeList} from './NarrativeList';

/**
 * Parent page component for the dashboard page
 * state: none
 * props: none
 * callbacks: none
 */
export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(props) {
    return (
      <section className='ph4 mt3'> <NarrativeList /> </section>
    );
  }
}
