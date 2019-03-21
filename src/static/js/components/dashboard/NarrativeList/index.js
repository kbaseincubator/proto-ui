import PropTypes from 'prop-types';
import React from 'react';
import {observable} from 'mobx';

// Components
import {Header, HeaderState} from './Header';
import {Filters, FiltersState} from './Filters';
import {ItemList, ItemListState} from './ItemList';
import {ItemDetails, ItemDetailsState} from './ItemDetails';

export class NarrativeListState {
  constructor() {
    this.itemList = new ItemListState();
    this.itemDetails = new ItemDetailsState(this.itemList);
  }
  @observable header = new HeaderState();
  @observable filters = new FiltersState();
}

export function NarrativeList ({state}) {
  return (
    <div>
      <Header state={ state.header } />
      <div className='ba b--black-20'>
        <Filters state={ state.filters } />
        <div className='pa3 flex'>
          <ItemList state={state.itemList } />
          <ItemDetails state={state.itemDetails } />
        </div>
      </div>
    </div>
  );
}

NarrativeList.propTypes = {
  state: PropTypes.object
}
