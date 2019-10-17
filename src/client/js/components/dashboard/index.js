// NPM
import {Component, h} from 'preact';

// Components
import {NarrativeList} from './NarrativeList';

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
