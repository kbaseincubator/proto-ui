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

// Utils
import { getUsername, getToken } from './utils/auth';
import { getPathname } from './utils/getPathname';
import { createBrowserHistory, History } from 'history';

const PATHNAME = getPathname();
const CONTAINER = document.getElementById('react-root');

// Change the style of the current item in the top-nav.
// For new nav:
document.querySelectorAll('[data-hl-nav]').forEach((node: Element) => {
  // Highlight the dashboard for the root path
  if (PATHNAME.match(new RegExp('^' + node.getAttribute('data-hl-nav')))) {
    node.className =
      'dib ph3 pv2 no-underline black-80 w-100 dim b bg-light-gray br bw2 b--green';
  }
});
// Highlight dashboard for root path
// For legacy nav:
document.querySelectorAll('[data-hl-legacy-nav]').forEach(node => {
  let HTMLEle: HTMLElement = node as HTMLElement;
  if (PATHNAME === node.getAttribute('data-hl-legacy-nav')) {
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
  const pageTitle = headerElem.getAttribute('data-page-title');
  render(<Header title={pageTitle || ''} />, headerElem);
}

interface Props {
  history?: History;
}

// Top level page component
class Page extends Component<Props, {}> {
  history: History;
  // History with a basename such as '/newnav/catalogog'
  nestedHistory: History;

  constructor(props: Props) {
    super(props);
    let basename = '';
    if (PATHNAME.match(/^\/newnav/)) {
      basename = '/newnav';
    }
    this.history = createBrowserHistory({basename});
    const paths = [
      '/dashboard',
      '/search',
      '/orgs',
      '/catalog',
      '/notifications',
      '/account'
    ];
    let nestedBasename = basename;
    // Set the basename to something like "/newnav/dashboard"
    const pathMatch = paths.find(path => {
      const reg = new RegExp('^' + basename + path);
      return PATHNAME.match(reg)
    });
    if (pathMatch) {
      nestedBasename += pathMatch;
    }
    console.log('basename, nestedbasename', basename, nestedBasename);
    this.nestedHistory = createBrowserHistory({ basename: nestedBasename });
  }

  render() {
    return (
      <Router history={this.history}>
        <Route path="/dashboard">
          <Dashboard history={this.nestedHistory} />
        </Route>
        <Route path="/search">
          <Todo text='Search' />
        </Route>
        <Route path="/orgs">
          <Todo text='Orgs' />
        </Route>
        <Route path="/catalog">
          <Catalog history={this.nestedHistory} />
        </Route>
        <Route path="/notifications">
          <Todo text='Notifications' />
        </Route>
        <Route path="/account">
          <Todo text='Account' />
        </Route>
        <Route path={/.*/}>
          <NotFoundPage />
        </Route>
      </Router>
    );
  }
}

function Todo (props: {text?: string}) {
  return <p>TODO {props.text}</p>;
}

// Render the top level page component
if (CONTAINER) {
  render(<Page />, CONTAINER);
}
