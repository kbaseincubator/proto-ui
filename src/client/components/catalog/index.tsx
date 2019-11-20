import React, { Component } from 'react';

import { fetchApps } from '../../utils/fetchApps';

// Components
import { SideNav } from './SideNav';
import { SearchInput } from '../generic/SearchInput';
import { LoadMoreBtn } from '../generic/LoadMoreBtn';

// TODO
// - table alignment
// - util to make necessary ajax requests
// - search, category, star/run sort, and pagination

/*
const fakeData: Array<FakeDatum> = [
  {
    name: 'Assess Genome Quality with CheckM - v1.0.18',
    desc: 'Runs the CheckM lineage workflow to assess the genome quality of isolates, single cells, or genome bins...',
    stars: 30,
    runs: 16148,
    iconColor: 'green',
    iconLetter: 'X',
    id: '0',
  }
]
*/

// Objects we
interface SDKApp {
  name: string;
  desc: string;
  stars: number;
  runs: number;
  iconColor: string;
  iconLetter: string;
  id: string;
}

// Catalog results directly in the server, converted into SDKApp above by mungeData
interface ServerResult {
  module_name: string;
  git_url: string;
}

interface Props {}

interface State {
  data: Array<SDKApp>;
  loading: boolean;
}

// Parent page component for the dashboard page
export class AppCatalog extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      data: []
    };
  }

  componentDidMount() {
    this.setState({loading: true});
    fetchApps().then((json) => {
      const hasResults = json.result && json.result.length && json.result[0].length;
      this.setState({
        data: mungeData(json.result[0]),
        loading: false
      });
    });
  }

  render() {
    return (
      <div className='flex'>
        <div style={{paddingTop: '5rem', width: '10rem'}} className='w4'>
          <SideNav />
        </div>
        <div className="ph4 mt3">
          <h2 className='mb4'>App Catalog</h2>

          <div className='mt3 flex items-baseline justify-between'>
            <div className='flex' style={{ minWidth: '30rem' }}>
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
            { this.state.data.map(rowView) }
          </div>


          <div className='pt3 mt4 bt b--black-20'>
            <LoadMoreBtn loading={ false } />
          </div>

        </div>
      </div>
    );
  }
}

function rowView (data: SDKApp) {
  return (
    <div className='mt3 pt3 bt b--black-20' key={data.id}>
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

function mungeData (inpData: Array<ServerResult>): Array<SDKApp> {
  const ret: Array<SDKApp> = [];
  return inpData.map(d => {
    return {
      name: d.module_name,
      desc: '',
      stars: 0,
      runs: 0,
      iconColor: 'blue',
      iconLetter: 'X',
      id: d.git_url,
    };
  });
  return ret;
}
