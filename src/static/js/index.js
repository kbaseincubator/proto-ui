/** @jsx h */
import {render, h, Component} from 'preact';

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

const container = document.getElementById('react-root');
if (container) {
  // Global page wrapper
  class Page extends Component {
    constructor(props) {
      super(props);
      this.state = {root: props.root.createState()};
    }

    updateRoot(updater) {
      this.setState(Object.assign(this.state, {
        root: updater(this.state.root),
      }));
    }

    render() {
      const RootComponent = this.props.root;
      return (
        <RootComponent
          {...this.state.root}
          handleUpdate={(up) => this.updateRoot(up)} />
      );
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
