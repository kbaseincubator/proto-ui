// Narrative list header with tabs
import {Component, h} from 'preact';
import * as timeago from 'timeago.js';
import mitt from 'mitt';

// Simple UI for a list of selectable search results
// params:
//  - items - array of objects
// methods:
//  - setItems
//  - appendItems
//  - loading
//  - notLoading
//  - selectItem
// events:
//  - wantsMore - user wants to load more results
//  - selected - user has selected an item in the list
export class ItemList extends Component {
  static createState({items = [], update}) {
    // TODO 'show more' style pagination
    return {
      update,
      term: '',
      loading: true,
      emitter: mitt(),
      items: [],
      totalItems: 0,
      activeItem: null,
      hasMore: false,
      currentPage: 1,
    };
  }

  // Set (and overwrite) the search results
  // Resets the active item to the first in the results
  static setItems(items, totalItems, state) {
    const hasMore = totalItems > items.length;
    state.update(Object.assign(state, {
      items,
      totalItems,
      activeItem: items[0],
      hasMore,
    }));
  }

  // Append a new page of items to the existing items
  static appendItems(items, totalItems, state) {
    const hasMore = totalItems > (items.length + state.items.length);
    const newState = Object.assign(state, {
      items: state.items.concat(items),
      totalItems,
      hasMore,
      currentPage: state.currentPage + 1,
    });
    state.update(newState);
  }

  static loading(state) {
    state.update(Object.assign(state, {loading: true}));
  }

  static notLoading(state) {
    state.update(Object.assign(state, {loading: false}));
  }

  static selectItem(item, state) {
    state.update(Object.assign(state, {activeItem: item}));
  }

  // Handle click event on the "load more" button
  handleClickLoadMore(ev) {
    const state = this.props.state;
    state.emitter.emit('wantsMore');
  }

  // Handle click event on an individual item
  handleClickItem(item) {
    const state = this.props.state;
    ItemList.selectItem(item, state);
    state.emitter.emit('selected', item);
  }

  render() {
    const state = this.props.state;
    const {items} = state;
    if (!items || !items.length) {
      if (state.loading) {
        // No results but still loading:
        return (
          <div className='w-100 tc black-50'>
            <p className='pv5'>
              <i className="fas fa-cog fa-spin mr2"></i>
              Loading...
            </p>
          </div>
        );
      } else {
        // No results and not loading
        return (
          <div className='w-100 tc black-80'>
            <p className='pv5'> No results found. </p>
          </div>
        );
      }
    }
    return (
      <div className='w-40'>
        { items.map((item) => itemView(this, item)) }
        { hasMoreButton(this) }
      </div>
    );
  }
}

function hasMoreButton(component) {
  const state = component.props.state;
  if (!state.hasMore) {
    return (
      <span
        className='black-50 pa3 dib tc'>
        No more results.
      </span>
    );
  }
  if (state.loading) {
    return (
      <span className='black-60 pa3 tc dib'>
        <i className="fas fa-cog fa-spin mr2"></i>
        Loading...
      </span>
    );
  }
  return (
    <a
      className='tc pa3 dib pointer blue dim b'
      onClick={(ev) => component.handleClickLoadMore(ev)}>
      Load more ({state.totalItems - state.items.length} remaining)
    </a>
  );
}

// view for a single narrative item
const itemView = (component, item) => {
  const state = component.props.state;
  const status = state.activeItem === item ? 'active' : 'inactive';
  const css = itemClasses[status];
  const data = item._source;
  // Action to select an item to view details
  return (
    <div onClick={() => component.handleClickItem(item)}
      key={ data.upa }
      className='br b--black-20'>
      <div className={css.outer}>
        <div className={css.inner}>
          <h4 className='ma0 mb2 pa0 f5'>{ data.name || 'Untitled' }</h4>
          <p className='ma0 pa0 f6'>
            Updated { timeago.format(data.timestamp) } by { data.creator }
          </p>
        </div>
      </div>
    </div>
  );
};

// Active and inactive classnames for the item listing
const itemClasses = {
  active: {
    inner: 'pv3 pr3',
    outer: 'ph3 bb b--black-20 bg-light-blue',
  },
  inactive: {
    inner: 'pv3 pr3',
    outer: 'ph3 bb b--black-20 dim black-70 pointer',
  },
};
