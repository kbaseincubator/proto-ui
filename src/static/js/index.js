/** @jsx h */
import {render, h, Component} from 'preact';

// Global env data
window._env = {
  token: 'GIJLFHAVDMXPAD4VKROUA36HYWSK26GP',  // XXX TODO REMOVE ME
  username: 'jayrbolton',
  kbase_endpoint: 'https://ci.kbase.us/services',
  narrative: 'https://ci.kbase.us',
  searchapi: 'https://ci.kbase.us/services/searchapi2/rpc',
}

// Components
import {Dashboard} from './components/dashboard';
import {ObjectRelations} from './components/object_relations';

// Underline the current item in the top-nav. Plain JS.
document.querySelectorAll('[data-hl-nav]').forEach((node) => {
  const p = document.location.pathname;
  if (p.indexOf(node.getAttribute('data-hl-nav')) === 0) {
    node.classList.add('bb', 'bw1', 'b--blue');
  }
});

// Render the Preact page component based on pathname
const container = document.getElementById('react-root');
if (container) {
  // Global page wrapper
  class Page extends Component {
    constructor(props) {
      super();
      this.state = {
        root: props.root.createState({
          update: root => this.setState({root})
        })
      };
    }

    render(props, state) {
      const RootComponent = props.root;
      return (<RootComponent state={state.root} />);
    }
  }

  // Simple routing by looking at pathname
  const pn = document.location.pathname;
  const routes = {
    '/iframe/dashboard': {
      component: Dashboard,
    },
    '/iframe/object_relations': {
      component: ObjectRelations,
    },
  };
  if (pn in routes) {
    const topComponent = routes[pn].component;
    render(<Page root={topComponent} />, container);
  }
}
