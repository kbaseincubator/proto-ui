// Narrative list header with tabs
import PropTypes from 'prop-types';
import React from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';

// ItemList state
export class ItemListState {
  // All narrative data for this page
  @observable items = [
    {
      title: 'Rhodo Assembly - Spades (KG)',
      saved_at: 1550360223484,
      author: 'jayrbolton',
      created_at: 1550360223484,
      total_cells: 12,
      visibility: 'private',
      share_count: 2,
      id: 0
    },
    {
      title: 'Build a Gene Tree - Tutorial - Copy',
      saved_at: 1552347472733,
      created_at: 1552347472733,
      total_cells: 25,
      visibility: 'public',
      author: 'jayrbolton',
      share_count: 0,
      id: 1
    },
    {
      title: 'FastANI - Variovorax test',
      saved_at: 1521395366900,
      created_at: 1521395366900,
      total_cells: 2,
      visibility: 'public',
      author: 'jayrbolton',
      share_count: 3,
      id: 2
    }
  ];

  @observable activeItem = 0; // Currently selected narrative

  // Select a narrative to view its details
  @action
  selectItem(idx) {
    if (this.activeItem === idx) return;
    this.activeItem = idx;
  }
}

// ItemList view
export const ItemList = observer(({state}) => {
  return (
    <div className='w-40'>
      { state.items.map((item, idx) => itemView(state, item, idx)) }
    </div>
  );
})

ItemList.propTypes = {
  state: PropTypes.object
}

// Active and inactive classnames for the item listing
const itemClasses = {
  active: {
    inner: 'pv3 br bw2 b--blue',
    outer: 'bb b--black-20'
  },
  inactive: {
    inner: 'pv3',
    outer: 'bb b--black-20 dim black-70 pointer'
  }
}

// view for a single narrative item
const itemView = (state, item, idx) => {
  // border to mark active item
  const status = idx === state.activeItem ? 'active' : 'inactive';
  const outerClass = itemClasses[status].outer;
  const innerClass = itemClasses[status].inner;
  return (
    <div onClick={() => state.selectItem(idx)} key={ item.id } className='br b--black-20'>
      <div className={ outerClass }>
        <div className={ innerClass }>
          <h4 className='ma0 mb2 pa0 f5'>{ item.title }</h4>
          {/* TODO moment time ago calculation here */}
          {/* TODO author compute to detect "you" */}
          <p className='ma0 pa0 f6'>Updated { item.saved_at } days ago by { item.author }</p>
        </div>
      </div>
    </div>
  );
}
