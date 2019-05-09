import {render, h, Component} from 'preact';
import {Dashboard} from './components/dashboard';
import {ObjectRelations} from './components/object_relations';

// Constants
const PATHNAME = document.location.pathname
    .replace(new RegExp('/' + window._env.url_prefix), '') // Remove global url prefix
    .replace(/\/$/, ''); // Remove trailing slash
const CONTAINER = document.getElementById('react-root');

// Underline the current item in the top-nav. Plain JS.
document.querySelectorAll('[data-hl-nav]').forEach((node) => {
  if (PATHNAME === node.getAttribute('data-hl-nav')) {
    node.classList.add('bg-light-gray', 'br', 'bw2', 'b--green');
  }
});

// Global page wrapper
class Page extends Component {
  constructor(props) {
    super();
    this.state = {
      root: props.root.createState({
        update: (root) => this.setState({root}),
      }),
    };
  }
  render(props, state) {
    const RootComponent = props.root;
    return (<RootComponent state={state.root} />);
  }
}

// Render the Preact page component based on pathname
if (CONTAINER) {
  // Simple routing by looking at pathname
  const routes = {
    '/dashboard': {
      component: Dashboard,
    },
    '/iframe/dashboard': {
      component: Dashboard,
    },
    '/iframe/object_relations': {
      component: ObjectRelations,
    },
  };
  if (PATHNAME in routes) {
    const topComponent = routes[PATHNAME].component;
    render(<Page root={topComponent} />, CONTAINER);
  } else {
    console.error(`Unable to find a React component for this page. Path: ${PATHNAME}. Routes: ${Object.keys(routes)}`); // eslint-disable-line
  }
}
