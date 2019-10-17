/*
// Pagination component
import PropTypes from 'prop-types';
import React from 'react';
import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react';

// Pagination data -- total pages, current page, etc
// Options:
//   - onSetPage - func - handler when the page changes
export class PaginationState {
  constructor(opts = {}) {
    this.onSetPage = opts.onSetPage;
    this.pageLength = opts.len || 12;
  }

  @observable totalItems = 0;
  @observable currentPage = 0;
  @observable pageLength = 1;

  @action prev() {
    if (this.isFirst) return;
    this.currentPage -= 1;
    if (this.onSetPage) this.onSetPage(this.currentPage);
  }

  @action next() {
    if (this.isLast) return;
    this.currentPage += 1;
    if (this.onSetPage) this.onSetPage(this.currentPage);
  }

  @action jump(page) {
    if (page >= this.pageLength || page < 0) {
      // Invalid page jump
      return
    }
    this.currentPage = page;
    if (this.onSetPage) this.onSetPage(this.currentPage);
  }

  @action setTotalItems(n) {
    this.totalItems = n;
  }

  @computed get isFirst() {
    return this.currentPage === 0;
  }
  @computed get isLast() {
    return this.currentPage === (this.totalPages - 1);
  }
  @computed get totalPages() {
    return Math.ceil(this.totalItems / this.pageLength);
  }
}

// Top-level page-list view
export const Pagination = observer(({state}) => {
  const pages = [];
  for (let i = 0; i < state.totalPages; ++i) {
    if (i === state.currentPage) {
      pages.push(<ActivePageLink i={i} state={state} />);
    } else {
      pages.push(<PageLink i={i} state={state} />);
    }
  }
  return (
    <div className='mt3 f6 flex justify-center'>
      <PrevBtn state={state} />
      {pages}
      <NextBtn state={state} />
    </div>
  );
});
Pagination.propTypes = {
  state: PropTypes.object
}

// Enabled/visitable page button
function PageLink ({i, state}) {
  const onClick = () => state.jump(i);
  return (
    <a
      className='b dim pointer dib bt bb br b--black-20 bg-white black-70 pv2 ph3'
      style={{userSelect: 'none'}}
      onClick={onClick}>
      {i + 1}
    </a>
  );
}
PageLink.propTypes = {
  i: PropTypes.number,
  state: PropTypes.object
}

// Active & disabled page button
function ActivePageLink ({i}) {
  return (
    <span className='b dib ba b--black-20 bg-blue white pv2 ph3' style={{userSelect: 'none'}}>
      {i + 1}
    </span>
  );
}
ActivePageLink.propTypes = {
  i: PropTypes.number
}

function PrevBtn ({state}) {
  const classes = {
    enabled: 'dib b dim pointer ba bg-white black-70 pv2 ph3 br2 br--left b--black-20',
    disabled: 'dib ba bg-white black-20 pv2 ph3 br2 br--left'
  };
  const onClick = () => state.prev();
  if (state.isFirst) {
    return (
      <span className={classes.disabled} style={{userSelect: 'none'}}>Previous</span>
    );
  } else {
    return (
      <a className={classes.enabled} style={{userSelect: 'none'}}
        onClick={onClick}>
        Previous
      </a>
    );
  }
}
PrevBtn.propTypes = {
  state: PropTypes.object
}

function NextBtn ({state}) {
  const classes = {
    enabled: 'dib b dim pointer ba bg-white black-70 pv2 ph3 br2 br--right b--black-20',
    disabled: 'dib ba bg-white black-20 pv2 ph3 br2 br--right'
  };
  if (state.isLast) {
    return (
      <span className={classes.disabled} style={{userSelect: 'none'}}>Next</span>
    );
  } else {
    const onClick = () => state.next();
    return (
      <a className={classes.enabled} style={{userSelect: 'none'}}
        onClick={onClick}>
        Next
      </a>
    );
  }
}
NextBtn.propTypes = {
  state: PropTypes.object
}
*/
