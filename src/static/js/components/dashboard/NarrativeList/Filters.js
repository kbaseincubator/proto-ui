// Narrative list header with tabs
import React from 'react';
// import {observable} from 'mobx';

// Filter state
export class FiltersState {
}

// Filter view
export function Filters () {
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
            style={{ paddingLeft: '2rem' }} />
        </div>
      </div>

      {/* Right-aligned actions */}
      <div className='pa2'>
        <a className='dim dib pa3 pointer'>Sort <i className="fas fa-caret-down"></i></a>
      </div>
    </div>
  );
}
