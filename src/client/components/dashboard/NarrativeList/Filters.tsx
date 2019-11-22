import React, { Component } from 'react';

// Components
import { FilterDropdown } from '../../generic/FilterDropdown';
import { SearchInput } from '../../generic/SearchInput';

interface State {
  searchParams: {
    term: string;
    sort: string;
  };
}

interface Props {
  onSetSearch: (searchParams: State['searchParams']) => void;
  loading: boolean;
}

// Filter bar for searching and sorting data results
export class Filters extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchParams: {
        term: '',
        sort: 'Newest',
      },
    };
  }

  // Handle an onSetVal event from SearchInput
  handleSearch(val: string): void {
    const searchParams = this.state.searchParams;
    searchParams.term = val;
    this.setState({ searchParams });
    if (this.props.onSetSearch) {
      this.props.onSetSearch(searchParams);
    }
  }

  // Handle an onSelect event from FilterDropdown
  handleFilter(idx: number, val: string): void {
    const searchParams = this.state.searchParams;
    searchParams.sort = val;
    this.setState({ searchParams });
    if (this.props.onSetSearch) {
      this.props.onSetSearch(searchParams);
    }
  }

  render() {
    const dropdownItems = [
      'Newest',
      'Oldest',
      'Recently updated',
      'Least recently updated',
    ];
    return (
      <div className="bg-light-gray flex justify-between">
        {/* Left-aligned actions (eg. search) */}
        <div className="pa3">
          <SearchInput
            loading={Boolean(this.props.loading)}
            onSetVal={this.handleSearch.bind(this)}
          />
        </div>

        {/* Right-aligned actions (eg. filter dropdown) */}
        <div className="pa2">
          <FilterDropdown
            onSelect={this.handleFilter.bind(this)}
            txt={'Sorting by'}
            items={dropdownItems}
          />
        </div>
      </div>
    );
  }
}
