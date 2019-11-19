import React, { Component } from 'react';

// Components
import { SearchInput } from '../generic/SearchInput';
import { LoadMoreBtn } from '../generic/LoadMoreBtn';

// TODO
// - table alignment
// - util to make necessary ajax requests
// - search, category, star/run sort, and pagination

interface FakeDatum {
  name: string;
  desc: string;
  stars: number;
  runs: number;
  iconColor: string;
  iconLetter: string;
}

const fakeData: Array<FakeDatum> = [
  {
    name: 'Assess Genome Quality with CheckM - v1.0.18',
    desc: 'Runs the CheckM lineage workflow to assess the genome quality of isolates, single cells, or genome bins...',
    stars: 30,
    runs: 16148,
    iconColor: 'green',
    iconLetter: 'X'
  },
  {
    name: 'Assess Read Quality with FastQC',
    desc: 'A quality control application for high throughput sequence data.',
    stars: 37,
    runs: 6107,
    iconColor: 'orange',
    iconLetter: 'Y'
  },
  {
    name: 'Filter Out Low-Complexity Reads with PRINSEQ - v0.20.4',
    desc: 'Filter out low-complexity paired- or single-end reads with PRINSEQ.',
    stars: 2,
    runs: 13,
    iconColor: 'blue',
    iconLetter: 'Z'
  }
]

// Parent page component for the dashboard page
export class AppCatalog extends Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="ph4 mt3">
        <h1 className='mb4'>App Catalog</h1>

        <div className='mt3 flex items-baseline justify-between'>
          <div className='w-70 flex'>
            <div className='relative'>
              <i className='fas fa-search black-30 absolute' style={{ top: '0.65rem', left: '0.5rem' }}></i>
              <SearchInput onSetVal={() => null} loading={false} />

            </div>

            <fieldset className='bn pa0 ml3'>
              <select className='br2 bn bg-light-gray pa2 black-80'>
                <option>Any category</option>
                <option>Read Processing</option>
                <option>Genome Assembly</option>
              </select>
            </fieldset>
          </div>

          <div className='pr4 b black-70 blue pointer'>Stars <span className='fas fa-caret-down'></span></div>
          <div className='b black-70 blue pointer'>Runs <span className='fas fa-caret-down'></span></div>
        </div>

        <div>
          { fakeData.map(rowView) }
        </div>


        <div className='pt3 mt4 bt b--black-20'>
          <LoadMoreBtn loading={ false } />
        </div>

      </div>
    );
  }
}

function rowView (data: FakeDatum) {
  return (
    <div className='mt3 pt3 bt b--black-20'>
      <div className='pointer flex justify-between hover-dark-blue'>
        <div className='w-70 flex'>
          <div className={`mt1 db flex justify-center w2 h2 bg-${data.iconColor} br2 pt1`}>
            <span className='db b white' style={{ paddingTop: '2px' }}>{data.iconLetter}</span>
          </div>

          <div className='ph3 b' style={{ flexShrink: 100 }}>
            { data.name }
            <span className='db normal black-60 pt1'>
              { data.desc }
            </span>
          </div>
        </div>

        <div className='ph2 o-70'>
          <span className='fas fa-star black-40 mr1'></span>
          { data.stars }
        </div>

        <div className='o-70'>
          { data.runs }
        </div>
      </div>
    </div>
  );
}
