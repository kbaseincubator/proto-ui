import React, { Component } from 'react';
import { render } from 'react-dom';

// Imports for page-specific components
// path: /dashboard
import { Dashboard } from './components/dashboard/index';
import { Account } from './components/Account/index';
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

// Get a pathname for the page without the global prefix for routing purposes.
// Eg. given a prefix of '/x/y' and a pathname of '/x/y/a/b', we want to get '/a/b'
let PATHNAME = document.location.pathname
  .replace(new RegExp('^' + window._env.url_prefix), '') // Remove global url prefix
  .replace(/\/$/, ''); // Remove trailing slash
if (PATHNAME[0] !== '/') {
  PATHNAME = '/' + PATHNAME;
}

const CONTAINER = document.getElementById('react-root');

// Change the style of the current item in the top-nav.
// For new nav:
document.querySelectorAll('[data-hl-nav]').forEach(node => {
  let HTMLEle: HTMLElement = node as HTMLElement;
  if (PATHNAME === node.getAttribute('data-hl-nav')) {
    HTMLEle.className =
      'dib ph3 pv2 no-underline black-80 w-100 dim b bg-light-gray br bw2 b--green';
  }
});
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

interface Props {
  root: typeof Dashboard | typeof ObjectRelations;
}

interface State {}

// Global page wrapper
class Page extends Component<Props, State> {
  render() {
    return <this.props.root />;
  }
}

// Global header
const headerElem = document.getElementById('react-global-header');
if (headerElem !== null) {
  const pageTitle = headerElem.getAttribute('data-page-title');
  render(<Header title={pageTitle || ''} />, headerElem);
}

// Render the page component based on pathname
if (CONTAINER) {
  // Simple routing by looking at pathname
  const routes: {
    [key: string]: { [key: string]: typeof Dashboard | typeof ObjectRelations };
  } = {
    '/dashboard': {
      component: Dashboard,
    },
    // For testing out an alternative nav design
    '/newnav/dashboard': {
      component: Dashboard,
    },
    '/newnav/account': {
      component: Account,
    },
    '/newnav/catalog': {
      component: Catalog,
    },
  };
  if (!(PATHNAME in routes)) {
    // Render 404
    render(<Page root={NotFoundPage} />, CONTAINER);
  } else {
    const topComponent = routes[PATHNAME].component;
    render(<Page root={topComponent} />, CONTAINER);
  }
}
