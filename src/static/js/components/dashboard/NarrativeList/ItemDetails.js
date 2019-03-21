// Narrative list header with tabs
import PropTypes from 'prop-types';
import React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

export class ItemDetailsState {
  constructor(itemList) {
    this.itemList = itemList;
  }
  @observable details = {};
}

// ItemDetails view
export const ItemDetails  = observer(({state}) => {
  const activeItem = state.itemList.items[state.itemList.activeItem];
  return (
    <div className='w-60 h-100 bg-white pv2 ph3 bl b--black-20'>
      <h4 className='mt0 pa0 f4'>
        <a className='blue pointer'>
          { activeItem.title }
        </a>
      </h4>

      <div className='flex mb3'>
        <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
          <i className="mr1 fas fa-external-link-alt"></i>
          Open
        </a>
        <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
          <i className="mr1 fas fa-share"></i>
          Share
        </a>
        <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
          <i className="mr1 fas fa-copy"></i>
          Copy
        </a>
      </div>

      <div className='mw6'>
        <dl className="ma0 flex justify-between bb b--black-20 pv2">
          <dt className="dib b">Author</dt>
          <dd className="dib ml0 grau tr black-70">{ activeItem.author }</dd>
        </dl>
        <dl className="ma0 flex justify-between bb b--black-20 pv2">
          <dt className="dib b">Creation date</dt>
          {/* TODO moment date */}
          <dd className="dib ml0 grau tr black-70">{ activeItem.created_at }</dd>
        </dl>
        <dl className="ma0 flex justify-between bb b--black-20 pv2">
          <dt className="dib b">Last updated</dt>
          {/* TODO moment date */}
          <dd className="dib ml0 grau tr black-70">{ activeItem.saved_at }</dd>
        </dl>
        <dl className="ma0 flex justify-between bb b--black-20 pv2">
          <dt className="dib b">Total cells</dt>
          <dd className="dib ml0 grau tr black-70">{ activeItem.total_cells }</dd>
        </dl>
        <dl className="ma0 flex justify-between bb b--black-20 pv2">
          <dt className="dib b">Visibility</dt>
          <dd className="dib ml0 grau tr black-70">{ activeItem.visibility }</dd>
        </dl>
        <dl className="ma0 flex justify-between pv2">
          <dt className="dib b">Share count</dt>
          <dd className="dib ml0 grau tr black-70">{ activeItem.share_count }</dd>
        </dl>
      </div>
    </div>
  );
});

ItemDetails.propTypes = {
  state: PropTypes.object
}
