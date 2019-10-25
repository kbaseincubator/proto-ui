import React, {Component} from 'react';
import * as timeago from 'timeago.js';

/**
 * Simple UI for a list of selectable search results
 * props:
 * - items
 * - loading
 * - totalItems
 * state:
 * - selectedIdx - Index of search result currently selected
 * callbacks:
 *  - onSelectItem - called when a new result is activated
 *  - onLoadMore - called when the "load more" button is clicked
 */
export class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Index of which result item the user has activated
      selectedIdx: 0,
    };
  }

  selectItem(idx) {
    if (idx < 0 || idx >= this.props.items.length) {
      throw new Error(`Invalid index for ItemList: ${idx}.
        Max is ${this.props.items.length - 1} and min is 0.`);
    }
    this.setState({selectedIdx: idx});
    if (this.props.onSelectItem) {
      this.props.onSelectItem(idx);
    }
  }

  // Handle click event on the "load more" button
  handleClickLoadMore(ev) {
    if (this.props.onLoadMore) {
      this.props.onLoadMore();
    }
  }

  // Handle click event on an individual item
  handleClickItem(idx) {
    this.selectItem(idx);
  }

  render() {
    const {items} = this.props;
    if (!items || !items.length) {
      if (this.props.loading) {
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
        { items.map((item, idx) => itemView(this, item, idx)) }
        { hasMoreButton(this) }
      </div>
    );
  }
}

function hasMoreButton(component) {
  const props = component.props;
  const hasMore = props.items.length < props.totalItems;
  if (!hasMore) {
    return (
      <span
        className='black-50 pa3 dib tc'>
        No more results.
      </span>
    );
  }
  if (props.loading) {
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
      onClick={(ev) => component.handleClickLoadMore(ev)} >
      Load more ({props.totalItems - props.items.length} remaining)
    </a>
  );
}

// view for a single narrative item
const itemView = (component, item, idx) => {
  const state = component.state;
  const status = state.selectedIdx === idx ? 'active' : 'inactive';
  const css = itemClasses[status];
  const data = item._source;
  // Action to select an item to view details
  return (
    <div onClick={() => component.handleClickItem(idx)}
      key={ data.upa }
      className='br b--black-20'>
      <div className={css.outer}>
        <div className={css.inner}>
          <h4 className='ma0 mb2 pa0 f5'>{ data.narrative_title || 'Untitled' }</h4>
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
