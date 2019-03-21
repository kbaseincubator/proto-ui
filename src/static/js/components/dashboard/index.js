import PropTypes from 'prop-types';
import React from 'react';
import {observable} from 'mobx';

// Components
import {NarrativeList, NarrativeListState} from './NarrativeList';

export class DashboardState {
  @observable narrativeList = new NarrativeListState();
}

export function Dashboard({state}) {
  return (
    <section className='ph4 mt3 mw8 center'>
      <NarrativeList state={ state.narrativeList } />
    </section>
  );
}

Dashboard.propTypes = {
  state: PropTypes.object
}
