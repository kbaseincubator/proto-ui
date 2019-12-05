import React, { Component } from 'react';
import { History, UnregisterCallback } from 'history';

import { fetchApps } from '../../utils/fetchApps';

// Components
import { NotFoundPage } from '../not_found';
import { Router, Route } from '../generic/Router';
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

interface Props {
  history: History;
}

interface State {}

// Parent page component for the dashboard page
export class Catalog extends Component<Props, State> {
  history: History;
  historyUnlisten?: UnregisterCallback;

  constructor(props: Props) {
    super(props);
    this.history = props.history;
    if (this.history.location.pathname === '/') {
      this.history.push('/apps');
    }
    this.state = {};
  }

  render() {
    return (
      <div className='mw8 center pv4'>
        <Router history={this.history}>

          <Route path={/^\/apps\/(.+)/}>
            <AppDetails />
          </Route>

          <Route path={/.*/}>

            <CatalogNav history={this.history} />

            <Router history={this.history}>
              <Route path="/apps">
                <AppCatalog />
              </Route>
              <Route path="/modules">
                <Todo text='modules' />
              </Route>
              <Route path="/types">
                <Todo text='types' />
              </Route>
              <Route path="/services">
                <Todo text='services' />
              </Route>
              <Route path="/admin">
                <Todo text='admin' />
              </Route>
              <Route path={/.*/}>
                <NotFoundPage />
              </Route>
            </Router>
            
          </Route>

        </Router>
      </div>
    );
  }
}

interface TodoProps {
  text: string;
}

function Todo (props: TodoProps) {
  return <p>TODO! {props.text || ''}</p>
}
