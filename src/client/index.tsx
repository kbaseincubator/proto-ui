import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

// Imports for page-specific components
// path: /dashboard
import { Dashboard } from './components/dashboard/index';
// path: /object_relations
import { ObjectRelations } from './components/object_relations/index';

import {Account} from './components/Account/index';
import {Header} from '../client/components/Header/Header'

// Utils
import { getUsername } from './utils/auth';

// Constants
const PATHNAME = document.location.pathname
  .replace(new RegExp('^' + window._env.url_prefix), '') // Remove global url prefix
  .replace(/\/$/, ''); // Remove trailing slash
const CONTAINER = document.getElementById('react-root');


// change background of the current item in the top-nav. Plain JS. Uses tachyons classes.
document.querySelectorAll('[data-hl-nav]').forEach(node => {
  let HTMLEle:HTMLElement = node as HTMLElement;
  HTMLEle.style
  if (PATHNAME === node.getAttribute('data-hl-nav')) {
    // to add style, it has to be HTMLElement and not node or Element
    HTMLEle.style.backgroundColor = '#e4e3e4';
  }
});

// Set the signed-in username in the global env
getUsername((username: string) => {
  window._env.username = username;
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

// Header
let pageTitle = (document.getElementById('header').getAttribute('pageTitle'))
ReactDOM.render(<Header headerTitle={pageTitle} />, document.getElementById('react-header'));
console.log('how many times does this run?')
// Render the page component based on pathname
if (CONTAINER) {
  // Simple routing by looking at pathname
  const routes: {
    [key: string]: { [key: string]: typeof Dashboard | typeof ObjectRelations };
  } = {
    '/dashboard': {component: Dashboard},
    '/account': {component: Account},
    '/iframe/dashboard': {component: Dashboard},
    '/iframe/object_relations': {component: ObjectRelations},
  };
  
  if (PATHNAME in routes) {
    console.log('how many times does this run? part 2')
    const topComponent = routes[PATHNAME].component;
    console.log('here', topComponent)
    render(<Page root={topComponent} />, CONTAINER);
  } else {
    console.error(
      `Unable to find a React component for this page. Path: ${PATHNAME}. Routes: ${Object.keys(
        routes
      )}`
    ); // eslint-disable-line
  }
}
