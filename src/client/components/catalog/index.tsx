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
const ROUTES: Array<{ path: string; component?: typeof Component }> = [
  { path: '/apps', component: AppCatalog },
  { path: '/modules' },
  { path: '/types' },
  { path: '/services' },
  { path: '/admin' },
];

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
    if (this.history.location.pathname === '/') {
      this.history.push('/apps');
      this.setState({ path: '/apps' });
    }
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
    const routeIdx = ROUTES.findIndex(route => {
      const regex = new RegExp('^' + route.path);
      return this.state.path.match(regex);
    });
    const route = ROUTES[routeIdx];
    if (route) {
      if (route.component) {
        return React.createElement(route.component, {});
      } else {
        return <p>TODO! {this.state.path}</p>;
      }
    } else {
      return (
        <NotFoundPage href="/newnav/catalog/apps" linkText="View the catalog" />
      );
    }
  }

  render() {
    // Render app details for a path like /apps/app-id
    if (this.state.path.match(APP_DETAILS_REGEX)) {
      return <AppDetails />;
    }
    return (
      <div className="mw8 ph4 pt4">
        <CatalogNav history={this.history} />
        {this.contentView()}
      </div>
    );
  }
}
