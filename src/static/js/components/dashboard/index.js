import {Component, h} from 'preact';

// Components
import {NarrativeList} from './NarrativeList';

// Utils
import {updateProp} from '../../utils/updateProp';

export class Dashboard extends Component {
  static createState() {
    return {narrativeList: NarrativeList.createState()};
  }

  render() {
    const {narrativeList} = this.props;
    return (
      <section className='ph4 mt3 mw8 center'>
        <NarrativeList {...narrativeList} handleUpdate={updateProp(this, 'narrativeList')} />
      </section>
    );
  }
}
