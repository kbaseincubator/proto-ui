import React, { Component } from 'react';

import { fetchApps } from '../../utils/fetchApps';

// Components
import { CatalogNav } from './CatalogNav';
import { AppCatalog } from './AppCatalog';
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

const CONTENT_COMPONENTS = [
  AppCatalog,
];

interface Props {}

interface State {
  selectedTabIdx: number;
}

// Parent page component for the dashboard page
export class Catalog extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedTabIdx: 0
    };
  }

  handleTabChange(idx: number) {
    this.setState({ selectedTabIdx: idx });
  }

  // View the content beneath the tabs
  contentView() {
    const contentComponent = CONTENT_COMPONENTS[this.state.selectedTabIdx];
    if (contentComponent) {
      return React.createElement(contentComponent, {});
    } else {
      return <p>TODO!</p>;
    }
  }

  render() {
    return (
      <div className="mw8 ph4 pt4">
        <CatalogNav onSelect={(idx) => this.handleTabChange(idx)} />
        { this.contentView() }
      </div>
    );
  }
}
