import PropTypes from 'prop-types';
import React from 'react';

// Components
import {Header, HeaderState} from './Header';
import {Filters} from './Filters';
import {ItemList, ItemListState} from './ItemList';
import {ItemDetails} from './ItemDetails';
import {Pagination} from '../../Pagination';

export class NarrativeListState {
  constructor() {
    this.itemList = new ItemListState();
    this.header = new HeaderState(this.itemList);
  }
}

export function NarrativeList ({state}) {
  return (
    <div>
      <Header state={state.header} />
      <div className='ba b--black-20'>
        <Filters state={state.itemList} />
        <div className='pa3 flex'>
          <ItemList state={state.itemList} />
          <ItemDetails state={state.itemList} />
        </div>
      </div>
      <Pagination state={state.itemList.pagination} />
    </div>
  );
}

NarrativeList.propTypes = {
  state: PropTypes.object
}
