// Narrative list header with tabs
import PropTypes from 'prop-types';
import React from 'react';
import * as timeago from 'timeago.js';
import {computed, observable, action} from 'mobx';
import {observer} from 'mobx-react';

import {PaginationState} from '../../Pagination';

// Class for a single narrative result
export class ItemState {
  constructor(data) {
    this.data = data;
  }

  // Is the item hidden in the results?
  @observable hidden = false;
  // Is selected by the user to view details
  @observable isActive = false;
  // Details such as title, author, creation date, etc
  @observable data = {};

  // created_at formatted like "10 days ago", "10 weeks ago", etc
  @computed get createdAgo() {
    return timeago.format(this.data.created_at);
  }

  // saved_at formatted like "10 days ago", "10 weeks ago", etc
  @computed get savedAgo() {
    return timeago.format(this.data.saved_at);
  }

  // Formatted date for created_at
  @computed get createdDate() {
    const d = new Date(this.data.created_at);
    return d.toLocaleDateString();
  }

  // Formatted date for saved_at
  @computed get savedDate() {
    const d = new Date(this.data.saved_at);
    return d.toLocaleDateString();
  }
}

// ItemList state
export class ItemListState {
  constructor () {
    this.pagination = new PaginationState({
      len: 12,
      onSetPage: () => {
        // Set the active narrative to the first item on the current page
        this.selectItem(this.itemPage[0]);
      }
    });
    this.fetchItems();
  }

  // List of items
  @observable items = [];

  // Currently selected narrative
  @observable activeItem;

  // Select a narrative to view its details
  @action selectItem(item) {
    if (this.activeItem) {
      this.activeItem.isActive = false;
    }
    this.activeItem = item;
    item.isActive = true;
  }

  // Fetch a new set of items
  @action fetchItems() {
    const totalItems = Math.floor(5 + Math.random() * 100);
    this.items = generateRandomItems(totalItems);
    // Switch item details to the top of the current page
    this.pagination.setTotalItems(totalItems);
    this.pagination.jump(0);
    this.selectItem(this.items[0]);
  }

  @action search(term) {
    if (term.trim() === '') {
      this.items.forEach(item => {
        item.hidden = false;
      })
    } else {
      const t = term.toLowerCase();
      this.items.forEach(item => {
        const title = item.data.title
        item.hidden = title.toLowerCase().indexOf(t) === -1;
      })
    }
    this.selectItem(this.itemPage[0]);
  }

  @action sortBy(option) {
    if (option === 'Newest') {
      this.items = this.items.sort((a, b) => {
        if (a.data.created_at < b.data.created_at) return -1;
        if (a.data.created_at > b.data.created_at) return 1;
        return 0;
      });
    } else if (option === 'Oldest') {
      this.items = this.items.sort((a, b) => {
        if (a.data.created_at > b.data.created_at) return -1;
        if (a.data.created_at < b.data.created_at) return 1;
        return 0;
      });
    }
  }

  // Get the slice of the current page of items
  @computed get itemPage() {
    const page = this.pagination.currentPage;
    const pageLen = this.pagination.pageLength;
    const offset = page * pageLen;
    return this.items.filter(i => !i.hidden).slice(offset, offset + pageLen);
  }
}

// ItemList view
export const ItemList = observer(({state}) => {
  return (
    <div className='w-40'>
      { state.itemPage.map(item => itemView(state, item)) }
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
const itemView = (state, item) => {
  const status = item.isActive ? 'active' : 'inactive';
  const css = itemClasses[status];
  return (
    <div onClick={() => state.selectItem(item)} key={ item.data.id } className='br b--black-20'>
      <div className={css.outer}>
        <div className={css.inner}>
          <h4 className='ma0 mb2 pa0 f5'>{ item.data.title }</h4>
          {/* TODO author compute to detect "you" */}
          <p className='ma0 pa0 f6'>Updated { item.savedAgo } by { item.data.author }</p>
        </div>
      </div>
    </div>
  );
}

function generateRandomItems (count) {
  let items = [];
  const randNum = (max) => Math.floor(Math.random() * max);
  const randTime = () => Date.now() - randNum(100000000);
  const randString = (len) => Math.random().toString(36).substring(len);
  for (let i = 0; i < count; i++) {
    items.push(new ItemState({
      title: 'Narrative ' + randString(7),
      saved_at: randTime(),
      created_at: randTime(),
      author: 'author-' + randString(7),
      total_cells: randNum(20),
      visibility: Math.random() > 0.5 ? 'public' : 'private',
      share_count: randNum(20),
      id: randNum(1000000)
    }));
  }
  return items
}
