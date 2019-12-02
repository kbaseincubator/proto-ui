import React, { Component } from 'react';

import { fetchApps } from '../../utils/fetchApps';

// Components
import { CatalogNav } from './CatalogNav';
import { AppCatalog } from './AppCatalog';
import { SearchInput } from '../generic/SearchInput';
import { LoadMoreBtn } from '../generic/LoadMoreBtn';

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
