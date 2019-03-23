// Narrative list header with tabs
import PropTypes from 'prop-types';
import React from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';

// Header state
export class HeaderState {
  constructor(itemList) {
    this.itemList = itemList;
  }

  tabs = [
    'My narratives',
    'Shared with me',
    'Tutorials',
    'Public'
  ];
  @observable selectedTab = 0;  // index into the tabs

  @action selectTab(idx) {
    if (idx === this.selectedTab) return
    this.selectedTab = idx;
    this.itemList.fetchItems();
  }
}

// Active and inactive tab styles
const tabClasses = {
  active: 'dib pv3 ph3 br--top br2 bt bl br b bg-light-gray b--black-20',
  inactive: 'dib pv3 pointer br--top br2 dim ph3 b--black-10 black-80'
}

// Header view
export const Header = observer(({state}) => {
  return (
    <div className='flex justify-between'>
      <div className='pt2'>
        <ul className='list pa0 ma0 flex items-center' style={{position: 'relative', top: '1px'}}>
          { 
            state.tabs.map((tabText, idx) => {
              const className = state.selectedTab === idx ? tabClasses.active : tabClasses.inactive;
              return <li key={tabText} className={className} onClick={() => state.selectTab(idx)}
                         style={{userSelect: 'none'}}>
                { tabText }
              </li>
            })
          }
        </ul>
      </div>

      <a className='pointer dim dib pa2 white br2 b bg-green dib' style={{marginTop: '1rem', height: '2.25rem'}}>
        <i className="mr1 fas fa-plus"></i> New Narrative
      </a>
    </div>
  );
});

Header.propTypes = {
  state: PropTypes.object
}
