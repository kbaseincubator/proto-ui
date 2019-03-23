// Narrative list filters
import PropTypes from 'prop-types';
import React from 'react';

import {FilterDropdown} from '../../FilterDropdown';

// Filter view
export function Filters ({state}) {
  const onSearch = ev => {
    const term = ev.currentTarget.value;
    state.search(term);
  }
  const onSortSelect = option => {
    state.sortBy(option);
  }
  return (
    <div className='bg-light-gray flex justify-between'>
      {/* Left-aligned actions */}
      <div className='pa3'>
        <div className='relative'>
          <i className='fas fa-search black-30 absolute' style={{top: '0.65rem', left: '0.5rem'}}></i>
          <input
            className='w5-l pa2 br2 ba b--solid b--black-20'
            type='text'
            placeholder='Search'
            onInput={onSearch}
            style={{ paddingLeft: '2rem' }} />
        </div>
      </div>

      {/* Right-aligned actions */}
      <div className='pa2'>
        <FilterDropdown
          txt='Author'
          selected='Any'
          items={['Any', 'user1', 'user2', 'user3']} />
        <FilterDropdown
          txt='Sort'
          selected='Newest'
          onSortSelect={onSortSelect}
          items={['Newest', 'Oldest', 'Recently updated', 'Least recently updated']} />
      </div>
    </div>
  );
}
Filters.propTypes = {
  state: PropTypes.object
}
