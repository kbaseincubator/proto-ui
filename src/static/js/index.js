// npm
import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';

// Components
import {Dashboard, DashboardState} from './components/dashboard';
import {ObjectRelations} from './components/object_relations';

// Underline the current item in the top-nav. Plain JS.
document.querySelectorAll('[data-hl-nav]').forEach((node) => {
  if (document.location.pathname.indexOf(node.getAttribute('data-hl-nav')) === 0) {
    node.classList.add('bb', 'bw1', 'b--blue');
  }
});

const container = document.getElementById('react-root');
if (container) {
  // Simple routing by looking at pathname
  const pn = document.location.pathname;
  const routes = {
    '/iframe/dashboard': () => ({
      state: DashboardState,
      node: Dashboard
    }),
    '/iframe/object_relations': () => ({
      node: ObjectRelations
    })
  }
  if (pn in routes) {
    const handler = routes[pn]();
    const topComponent = observer(handler.node);
    const topState = new handler.state();
    const node = React.createElement(topComponent, {state: topState});
    ReactDOM.render(node, container);
  }
}
