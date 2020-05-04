import React, { Component } from 'react';
import { Doc } from '../../../utils/narrativeData';
const timeago = require('timeago.js');

interface Props {
  items: Array<Doc>;
  loading: boolean;
  totalItems: number;
  onLoadMore?: () => void;
  onSelectItem?: (idx: number) => void;
  selectedIdx: number;
}

interface State {}

// Simple UI for a list of selectable search results
export class ItemList extends Component<Props, State> {
  selectItem(idx: number) {
    if (idx < 0 || idx >= this.props.items.length) {
      throw new Error(`Invalid index for ItemList: ${idx}.
        Max is ${this.props.items.length - 1} and min is 0.`);
    }
    if (this.props.onSelectItem) {
      this.props.onSelectItem(idx);
    }
  }

  // Handle click event on the "load more" button
  handleClickLoadMore(ev: React.MouseEvent) {
    if (this.props.onLoadMore) {
      this.props.onLoadMore();
    }
  }

  // Handle click event on an individual item
  handleClickItem(idx: number) {
    this.selectItem(idx);
  }

  // view for a single narrative item
  itemView = (item: Doc, idx: number) => {
    // I need this until I figure out what's in item
    const status = this.props.selectedIdx === idx ? 'active' : 'inactive';
    const css = itemClasses[status];
    const upa = `${item.access_group}/${item.obj_id}/${item.version}`;
    // Action to select an item to view details
    return (
      <div
        onClick={() => this.handleClickItem(idx)}
        key={upa}
        className="br b--black-20"
      >
        <div className={css.outer}>
          <div className={css.inner}>
            <h4 className="ma0 mb2 pa0 f5">
              {item.narrative_title || 'Untitled'}
            </h4>
            <p className="ma0 pa0 f6">
              Updated {timeago.format(item.timestamp)} by {item.creator}
            </p>
          </div>
        </div>
      </div>
    );
  };

  hasMoreButton() {
    const hasMore = this.props.items.length < this.props.totalItems;
    if (!hasMore) {
      return <span className="black-50 pa3 dib tc">No more results.</span>;
    }
    if (this.props.loading) {
      return (
        <span className="black-60 pa3 tc dib">
          <i className="fa fa-cog fa-spin mr2"></i>
          Loading...
        </span>
      );
    }
    return (
      <a
        className="tc pa3 dib pointer blue dim b"
        onClick={(ev: React.MouseEvent) => this.handleClickLoadMore(ev)}
      >
        Load more ({this.props.totalItems - this.props.items.length} remaining)
      </a>
    );
  }

  render() {
    const { items } = this.props;
    if (!items || !items.length) {
      if (this.props.loading) {
        // No results but still loading:
        return (
          <div className="w-100 tc black-50">
            <p className="pv5">
              <i className="fa fa-cog fa-spin mr2"></i>
              Loading...
            </p>
          </div>
        );
      } else {
        // No results and not loading
        return (
          <div className="w-100 tc black-80">
            <p className="pv5"> No results found. </p>
          </div>
        );
      }
    }
    return (
      <div className="w-40">
        {items.map((item, idx) => this.itemView(item, idx))}
        {this.hasMoreButton()}
      </div>
    );
  }
}

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
