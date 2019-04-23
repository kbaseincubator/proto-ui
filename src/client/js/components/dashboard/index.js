// NPM
import {Component, h} from 'preact';

// Components
import {NarrativeList} from './NarrativeList';

// Utils
import {updateProp} from '../../utils/updateProp';

export class Dashboard extends Component {
  static createState({update}) {
    const state = {update};
    state.narrativeList = NarrativeList.createState({
      update: updateProp(state, 'narrativeList')
    })
    return state;
  }

  render(props) {
    const {narrativeList} = props.state;
    return (
      <section className='ph4 mt3 mw8 center'>
        <NarrativeList state={narrativeList} />
      </section>
    );
  }
}
