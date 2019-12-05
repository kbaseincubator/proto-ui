import React, { Component } from 'react';

import { fetchApps } from '../../utils/fetchApps';
import { History, UnregisterCallback } from 'history';

// Components
import { NotFoundPage } from '../not_found';
import { CatalogNav } from './CatalogNav';
import { AppCatalog } from './AppCatalog';
import { SearchInput } from '../generic/SearchInput';
import { LoadMoreBtn } from '../generic/LoadMoreBtn';
import { AppDetails } from '../app_details';

// Every component in an array, where the index of each component corresponds to
// its tab index
const ROUTES: {[key: string]: {component?: typeof Component}} = {
  '/': { component: AppCatalog },
  '/apps': { component: AppCatalog },
  '/modules': {},
  '/types': {},
  '/services': {},
  '/admin': {},
}
const APP_DETAILS_REGEX = /\/apps\/(.+)/;

interface Props {
  history: History;
}

interface State {
  path: string;
}

// Parent page component for the dashboard page
export class Catalog extends Component<Props, State> {
  history: History;
  historyUnlisten?: UnregisterCallback;

  constructor(props: Props) {
    super(props);
    this.history = props.history;
    this.state = {
      path: this.history.location.pathname || '/',
    };
  }

  componentDidMount() {
    // Listen to changes to location history to update the page
    this.historyUnlisten = this.history.listen((location, action) => {
      this.setState({ path: location.pathname });
    });
  }

  componentWillUnmount() {
    // Stop listening to location history
    if (this.historyUnlisten) {
      this.historyUnlisten();
    }
  }

  // View the content beneath the tabs
  contentView() {
    const route = ROUTES[this.state.path];
    if (route) {
      if (route.component) {
        return React.createElement(route.component, {});
      } else {
        return <p>TODO! {this.state.path}</p>;
      }
    } else {
      return <NotFoundPage href="/newnav/catalog/apps" linkText="View the catalog" />;
    }
  }

  render() {
    // Render app details for a path like /apps/app-id
    if (this.state.path.match(APP_DETAILS_REGEX)) {
      return <AppDetails />
    }
    return (
      <div className="mw8 ph4 pt4">
        <CatalogNav history={this.history} />
        {this.contentView()}
      </div>
    );
  }
}
