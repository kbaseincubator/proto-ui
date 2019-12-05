import React, { Component } from 'react';
import { render } from 'react-dom';

// Imports for page-specific components
import { Router, Route } from '../client/components/generic/Router';
// path: /dashboard
import { Dashboard } from './components/dashboard/index';
// path: /object_relations
import { ObjectRelations } from './components/object_relations/index';
// path: /catalog
import { Catalog } from './components/catalog/index';
// Used when a suffix from some base-path is not found, such as "/account/xyz"
import { NotFoundPage } from './components/not_found';
// Global navigation (legacy copy of previous kbase-ui)
import { Header } from '../client/components/global_header/Header';

import { Unauthorized } from '../client/components/unauthorized_page/UnauthorizedPage';

// Utils
import { getUsername, getToken } from './utils/auth';
import { createBrowserHistory, History } from 'history';

// Top-level URL history object, possibly with basename of '/newnav'
const history = createBrowserHistory({ basename: window._env.urlPrefix });
const CONTAINER = document.getElementById('react-root');

// Change the style of the current item in the top-nav.
// For new nav:
document.querySelectorAll('[data-hl-nav]').forEach((node: Element) => {
  // Highlight the dashboard for the root path
  const path = history.location.pathname;
  if (path.match(new RegExp('^' + node.getAttribute('data-hl-nav')))) {
    node.className =
      'dib ph3 pv2 no-underline black-80 w-100 dim b bg-light-gray br bw2 b--green';
  }
});
// Highlight dashboard for root path
// For legacy nav:
document.querySelectorAll('[data-hl-legacy-nav]').forEach(node => {
  let HTMLEle: HTMLElement = node as HTMLElement;
  const path = history.location.pathname;
  if (path === node.getAttribute('data-hl-legacy-nav')) {
    HTMLEle.style.backgroundColor = '#e4e3e4';
  }
});

// Set the signed-in username in the global env
getUsername((username: string | null) => {
  if (username) {
    window._env.username = username;
  }
});

// Global header (legacy design)
const headerElem = document.querySelector('#react-global-header');
if (headerElem) {
  let pageTitle = '';
  if (getToken()) {
    pageTitle = headerElem.getAttribute('data-page-title') || '';
  }
  render(<Header title={pageTitle || ''} />, headerElem);
}

interface Props {
  history?: History;
}

// Top level page component
class Page extends Component<Props, {}> {
  // Nested history object for routing in child components
  // With a basename such as '/newnav/catalog'
  nestedHistory: History;

  constructor(props: Props) {
    super(props);
    // Created a nested history object with a basename for the child component
    const paths = [
      '/dashboard',
      '/search',
      '/orgs',
      '/catalog',
      '/notifications',
      '/account',
    ];
    let nestedBasename = '';
    const pathMatch = paths.find(path => {
      const reg = new RegExp('^' + path);
      return history.location.pathname.match(reg);
    });
    if (pathMatch) {
      nestedBasename = pathMatch;
    }
    this.nestedHistory = createBrowserHistory({
      basename: window._env.urlPrefix + nestedBasename,
    });
  }

  render() {
    return (
      <Router history={history}>
        <Route path="/dashboard">
          <Dashboard history={this.nestedHistory} />
        </Route>
        <Route path="/search">
          <Todo text="Search" />
        </Route>
        <Route path="/orgs">
          <Todo text="Orgs" />
        </Route>
        <Route path="/catalog.*">
          <Catalog history={this.nestedHistory} />
        </Route>
        <Route path="/notifications">
          <Todo text="Notifications" />
        </Route>
        <Route path="/account">
          <Todo text="Account" />
        </Route>
        <Route path={/.*/}>
          <NotFoundPage />
        </Route>
      </Router>
    );
  }
}

// Placeholder component for pages we have not implemented yet
function Todo(props: { text?: string }) {
  return <p>TODO {props.text}</p>;
}

// Render the top level page component
if (CONTAINER) {
  if (!getToken()) {
    render(<Unauthorized />, CONTAINER);
    // Hide the legacy side nav, if present
    const sidenav = document.querySelector('.legacy-nav');
    if (sidenav) {
      (sidenav as HTMLElement).style.display = 'none';
    }
  } else {
    render(<Page />, CONTAINER);
  }
}
