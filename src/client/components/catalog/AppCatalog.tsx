import React, { Component } from 'react';

import {
  fetchApps,
  CombinedResult,
  DetailsResult,
} from '../../utils/fetchApps';
import { sortBy } from '../../utils/sortBy';
import { formatSnakeCase } from '../../utils/formatSnakeCase';

// Components
import { SearchInput } from '../generic/SearchInput';
import { LoadMoreBtn } from '../generic/LoadMoreBtn';
import { LoadingSpinner } from '../generic/LoadingSpinner';

const PAGE_SIZE = 20;

// Search results directly used in the presentation layer
interface SDKApp {
  name: string;
  desc: string;
  runs: number;
  id: string;
  hidden?: boolean;
  categories: Array<string>;
  icon?: { url: string };
}

interface Props {}

enum Tag {
  Dev = 'dev',
  Beta = 'beta',
  Release = 'release',
}

interface State {
  rawData: Array<SDKApp>;
  results: Array<SDKApp>;
  categories: Array<string>;
  loading: boolean;
  currentPage: number;
}

// Parent page component for the dashboard page
export class AppCatalog extends Component<Props, State> {
  category: string = 'any';
  searchTerm: string = '';
  tag: Tag = Tag.Release;
  runsDesc: boolean = true;

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      rawData: [],
      results: [],
      currentPage: 0,
      categories: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // Fetch the app data
  fetchData() {
    this.setState({ loading: true });
    fetchApps(this.tag).then(result => {
      const data = mungeData(result);
      this.setState({
        rawData: data,
        categories: result.categories,
        loading: false,
      });
      this.applyResultFilters();
    });
  }

  // Load more button click; show more results
  appendPage() {
    this.setState({ currentPage: this.state.currentPage + 1 });
  }

  // Handle input to the search box. In-memory search with no network request.
  handleSearchInput(val: string) {
    this.searchTerm = val;
    this.applyResultFilters();
  }

  // Apply the search term and other filters to get a list of results
  applyResultFilters() {
    const val = this.searchTerm.toLowerCase();
    const cat = this.category;
    let results = this.state.rawData.filter((item: SDKApp) => {
      // Match the search term on name or description
      const searchMatch =
        val === '' ||
        item.name.toLowerCase().indexOf(val) !== -1 ||
        item.desc.toLowerCase().indexOf(val) !== -1;
      if (!searchMatch) {
        // Return early to save cycles
        return false;
      }
      // Match the category filter against each result's category array
      const catMatch = cat === 'any' || item.categories.indexOf(cat) !== -1;
      return searchMatch && catMatch;
    });
    results = sortBy(results, item => {
      return this.runsDesc ? -item.runs : item.runs;
    });
    this.setState({ results, currentPage: 0 });
  }

  // Click the ascending/descending toggle to sort by app runs
  handleClickRuns() {
    this.runsDesc = !this.runsDesc;
    this.applyResultFilters();
  }

  // Select an option in the release/beta/dev dropdown filter
  handleChangeTag(ev: React.ChangeEvent<HTMLSelectElement>) {
    const val = ev.currentTarget.value;
    this.tag = Tag.Release;
    if (val === 'beta') {
      this.tag = Tag.Beta;
    } else if (val === 'dev') {
      this.tag = Tag.Dev;
    } else if (val === 'release') {
      this.tag = Tag.Release;
    } else {
      throw new Error('Invalid tag: ' + val);
    }
    this.fetchData();
  }

  // Handle the dropdown change event for the category filter
  handleCategoryChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    const cat = ev.currentTarget.value;
    this.category = cat;
    this.applyResultFilters();
  }

  render() {
    const pg = this.state.currentPage;
    const results = this.state.results.slice(0, PAGE_SIZE * pg + PAGE_SIZE);
    let rowWrapClassName = '';
    if (this.state.loading && this.state.results.length) {
      rowWrapClassName = 'o-30';
    }
    return (
      <div className="mt4">
        <div className="mt3 flex items-baseline justify-between">
          <div className="flex" style={{ minWidth: '30rem' }}>
            <div className="relative">
              <i
                className="fas fa-search black-30 absolute"
                style={{ top: '0.65rem', left: '0.5rem' }}
              ></i>
              <SearchInput
                onSetVal={val => this.handleSearchInput(val)}
                loading={false}
              />
            </div>

            {categoryDropdownView(this)}

            <fieldset className="bn pa0 ml3">
              <select
                className="br2 bn bg-light-gray pa2 black-80"
                onChange={this.handleChangeTag.bind(this)}
              >
                <option value="release">Released</option>
                <option value="beta">In beta</option>
                <option value="dev">In development</option>
              </select>
            </fieldset>
          </div>

          {runsSorterView(this)}
        </div>

        <LoadingSpinner
          loading={this.state.loading && !this.state.results.length}
        />

        <div
          className={rowWrapClassName}
          style={{ transition: 'opacity linear 0.1s' }}
        >
          {results.map(rowView)}
        </div>

        {loadMoreButtonView(this)}
      </div>
    );
  }
}

// View for the category filter dropdown
function categoryDropdownView(component: AppCatalog) {
  const cats = component.state.categories;
  if (cats.length === 0) {
    // No categories available; disable and reduce opacity
    <fieldset className="bn pa0 ml3">
      <select
        disabled
        className="o-30 br2 bn bg-light-gray pa2 black-80"
      ></select>
    </fieldset>;
  }
  const optionView = (cat: string) => {
    return (
      <option key={cat} value={cat}>
        {formatSnakeCase(cat)}
      </option>
    );
  };
  return (
    <fieldset className="bn pa0 ml3">
      <select
        className="br2 bn bg-light-gray pa2 black-80"
        onChange={ev => component.handleCategoryChange(ev)}
      >
        <option value="any">Any category</option>
        {cats.map(optionView)}
      </select>
    </fieldset>
  );
}

// View for the button to sort results by number of app runs
function runsSorterView(component: AppCatalog) {
  if (!component.state.results.length) {
    // Inactive state
    return (
      <div className="black-20">
        <span className="dib mr2"> Runs </span>
        <span className="fa fa-circle black-10"></span>
      </div>
    );
  }
  return (
    <div
      className="b black-70 blue pointer dim"
      onClick={component.handleClickRuns.bind(component)}
    >
      <span className="dib mr2"> Runs </span>
      <span
        className={component.runsDesc ? 'fa fa-caret-down' : 'fa fa-caret-up'}
      ></span>
    </div>
  );
}

// Button to load more results (hide if we are initially loading)
function loadMoreButtonView(component: AppCatalog) {
  if (component.state.loading) {
    return '';
  }
  const totalItems = component.state.results.length;
  let itemCount = PAGE_SIZE * (component.state.currentPage + 1);
  if (itemCount > totalItems) {
    itemCount = totalItems;
  }
  return (
    <div className="pt3 mt4 bt b--black-20">
      <LoadMoreBtn
        loading={false}
        onLoadMore={() => component.appendPage()}
        totalItems={totalItems}
        itemCount={itemCount}
      />
    </div>
  );
}

function rowView(result: SDKApp) {
  if (result.hidden) {
    return '';
  }
  let appIcon = (
    <span
      className="f3 db b white bg-blue br3 flex justify-center items-center o-80"
      style={{ width: '3rem' }}
    >
      <span className="fa fa-cube"></span>
    </span>
  );
  if (result.icon && result.icon.url) {
    const nmsUrl = window._env.kbase_endpoint + '/narrative_method_store/';
    appIcon = <img src={nmsUrl + result.icon.url} />;
  }
  // Truncate the description to 180 chars
  let desc = result.desc;
  if (desc.length > 180) {
    desc = desc.slice(0, 180) + '...';
  }
  return (
    <div className="mt3 pt3 bt b--black-20" key={result.id}>
      <div className="pointer flex justify-between hover-dark-blue">
        <div className="w-70 flex">
          <div
            className="mt1 db flex justify-center"
            style={{ width: '3rem', height: '3rem' }}
          >
            {appIcon}
          </div>

          <div className="ph3 b" style={{ flexShrink: 100 }}>
            {result.name}
            <span className="db normal black-60 pt1">{desc}</span>
          </div>
        </div>

        <div className="o-70">{result.runs}</div>
      </div>
    </div>
  );
}

// Convert data from the server into objects that we use directly in the UI
function mungeData(inpData: CombinedResult): Array<SDKApp> {
  let ret = inpData.details.map((data: DetailsResult) => {
    const name = data.id.replace(data.module_name + '/', '');
    const runs = inpData.runs[data.id.toLowerCase()] || 0;
    return {
      name: data.name,
      desc: data.tooltip,
      runs,
      id: data.id,
      categories: data.categories,
      icon: data.icon,
    };
  });
  ret = sortBy(ret, d => -d.runs);
  return ret;
}
