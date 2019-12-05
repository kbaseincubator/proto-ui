import React, { Component } from 'react';
import { History, UnregisterCallback } from 'history';

// Components

// Constants
const ROUTES: Array<{ paths: Array<string>; name: string }> = [
  { paths: ['/apps', '/'], name: 'Apps' },
  { paths: ['/modules'], name: 'Modules' },
  { paths: ['/types'], name: 'Data types' },
  { paths: ['/services'], name: 'Services' },
  { paths: ['/admin'], name: 'Admin' },
];

interface Props {
  history: History;
}
interface State {
  selectedIdx: number;
}

// Parent page component for the dashboard page
export class CatalogNav extends Component<Props, State> {
  // URL location history
  history: History;
  // Callback to stop listening to history
  historyUnlisten?: UnregisterCallback;

  constructor(props: any) {
    super(props);
    this.history = props.history;
    this.state = { selectedIdx: 0 };
  }

  componentDidMount() {
    // Get the tab index from the url location
    const getIdx = () => {
      const path = this.history.location.pathname;
      return ROUTES.findIndex(tab => tab.paths.indexOf(path) !== -1) || 0;
    };
    const idx = getIdx();
    this.setState({ selectedIdx: idx });
    // On any url change, set the current tab
    this.historyUnlisten = this.history.listen((location, action) => {
      this.setState({ selectedIdx: getIdx() });
    });
  }

  componentWillUnmount() {
    // Stop listening to the location history
    if (this.historyUnlisten) {
      this.historyUnlisten();
    }
  }

  // Handler for a tab click
  handleClickItem(ev: React.MouseEvent<HTMLElement>, idx: number) {
    ev.preventDefault();
    if (idx < 0 || idx >= ROUTES.length) {
      throw new Error('Invalid index: ' + idx);
    }
    if (idx === this.state.selectedIdx) {
      return;
    }
    this.setState({ selectedIdx: idx });
    // Push tab state to window location history
    this.history.push(ROUTES[idx].paths[0]);
  }

  // View each tab item
  tabView(name: string, idx: number) {
    const active = this.state.selectedIdx === idx;
    const cls = itemClasses[active ? 'active' : 'inactive'];
    return (
      <a
        href={window._env.basepath + ROUTES[idx].paths[0]}
        key={name}
        className={cls}
        onClick={ev => this.handleClickItem(ev, idx)}
      >
        {name}
      </a>
    );
  }

  render() {
    return (
      <div className="flex black br--top br3 o-70 bb b--black-10">
        {ROUTES.map((route, idx) => this.tabView(route.name, idx))}
      </div>
    );
  }
}

const itemClasses = {
  active: 'dib link ph3 pv2 b bb bw2 b--dark-green black pointer',
  inactive: 'dim dib link ph3 pv2 f5 black pointer',
};
