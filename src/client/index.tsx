import React, { Component } from 'react';
import { render } from 'react-dom';

// Imports for page-specific components
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
// App catalog details page
import { AppDetails } from '../client/components/app_details';

// Utils
import { getUsername, getToken } from './utils/auth';
import { getPathname } from './utils/getPathname';
import { createBrowserHistory, History } from 'history';

const PATHNAME = getPathname()
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
  root: typeof Component;
  history?: History;
}

// Global page component wrapper
class Page extends Component<Props, {}> {
  render() {
    return <this.props.root history={this.props.history} />;
  }
}

// What components map to what base pathnames
const ROUTES: {[key: string]: {component: typeof Component}} = {
  '/newnav/dashboard': { component: Dashboard },
  '/dashboard': { component: Dashboard },
  '/newnav/catalog': { component: Catalog },
}

// Render the page component based on pathname
if (CONTAINER) {
  let matchedPath = false;
  for (const path in ROUTES) {
    if (PATHNAME.match(new RegExp('^' + path))) {
      window._env.basepath = path;
      const history = createBrowserHistory({ basename: path });
      render(<Page root={ROUTES[path].component} history={history} />, CONTAINER);
      matchedPath = true;
      break;
    }
  }
  if (!matchedPath) {
    // Render 404
    render(<Page root={NotFoundPage} />, CONTAINER);
  }
}
