import React, { Component } from 'react';

import { fetchApps, CombinedResult, DetailsResult } from '../../utils/fetchApps';
import { sortBy } from '../../utils/sortBy';

// Components
import { SearchInput } from '../generic/SearchInput';
import { LoadMoreBtn } from '../generic/LoadMoreBtn';

const PAGE_SIZE = 20;

// TODO
// - search
// - sort by runs
// - filter by category
// - remove stars
// - table alignment
// - mockup for an app page
// Stretch
// - filter by input and output types
// - Cache modules and apps in localstorage and update async

// Search results directly used in the presentation layer
interface SDKApp {
  name: string;
  desc: string;
  stars: number;
  runs: number;
  iconColor: string;
  iconLetter: string;
  id: string;
}

interface Props {}

interface State {
  data: Array<SDKApp>;
  loading: boolean;
  currentPage: number;
}

// Parent page component for the dashboard page
export class AppCatalog extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      currentPage: 0,
    };
  }

  componentDidMount() {
    this.setState({loading: true});
    fetchApps().then((result) => {
      const hasResults = result && result.details && result.details.length;
      console.log('results', result);
      this.setState({
        data: mungeData(result),
        loading: false
      });
    });
  }

  // Load more button click; show more results
  appendPage() {
    this.setState({ currentPage: this.state.currentPage + 1 });
  }

  render() {
    const pg = this.state.currentPage;
    const data = this.state.data.slice(0, PAGE_SIZE * pg + PAGE_SIZE);
    return (
      <div className="mt4">
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

          <div className='pr4 b black-70 blue pointer'>Stars <span className='fa fa-caret-down'></span></div>
          <div className='b black-70 blue pointer'>Runs <span className='fa fa-caret-down'></span></div>
        </div>

        { loadingView(this) }

        <div>
          { data.map(rowView) }
        </div>

        { loadMoreButtonView(this) }

      </div>
    );
  }
}

// Loading spinner
function loadingView (component: AppCatalog) {
  if (!component.state.loading) {
    return '';
  }
  return (
    <p className='black-60 mt3'><i className='fa fa-gear fa-spin'></i> Loading...</p>
  );
}

// Button to load more results (hide if we are initially loading)
function loadMoreButtonView (component: AppCatalog) {
  if (component.state.loading) {
    return '';
  }
  // loading: boolean;
  // itemCount?: number;
  // totalItems?: number;
  // onLoadMore?: () => void;
  return (
    <div className='pt3 mt4 bt b--black-20'>
      <LoadMoreBtn
        loading={false}
        onLoadMore={() => component.appendPage()}
        totalItems={component.state.data.length}
        itemCount={PAGE_SIZE * component.state.currentPage}
      />
    </div>
  );
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
          <span className='fa fa-star black-40 mr1'></span>
          { data.stars }
        </div>

        <div className='o-70'>
          { data.runs }
        </div>
      </div>
    </div>
  );
}

function mungeData (inpData: CombinedResult): Array<SDKApp> {
  let ret = inpData.details.map((d: DetailsResult) => {
    const name = d.id.replace(d.module_name + '/', '');
    const stars = inpData.stars[d.id.toLowerCase()] || 0;
    const runs = inpData.runs[d.id.toLowerCase()] || 0;
    return {
      name: d.name,
      desc: d.tooltip,
      stars,
      runs,
      iconColor: 'blue',
      iconLetter: 'X',
      id: d.id
    };
  });
  ret = sortBy(ret, (d) => -d.runs);
  return ret;
}
