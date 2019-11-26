import React, { Component } from 'react';

// Components

// Constants
const ITEMS = ['Apps', 'Modules', 'Data types', 'Services', 'Admin'];

interface Props {
  onSelect: (idx: number) => void
}
interface State {
  selectedIdx: number;
}

// Parent page component for the dashboard page
export class CatalogNav extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
        selectedIdx: 0,
    };
  }

  handleClickItem(idx: number) {
    if (idx < 0 || idx >= ITEMS.length) {
      throw new Error("Invalid index: " + idx);
    }
    this.setState({ selectedIdx: idx });
    if (this.props.onSelect) {
      this.props.onSelect(idx);
    }
  }

  itemView(name: string, idx: number) {
    const active = this.state.selectedIdx === idx;
    const cls = itemClasses[active ? 'active' : 'inactive'];
    return (
      <a key={name} className={cls} onClick={() => this.handleClickItem(idx)}>
        {name}
      </a>
    );
  }

  render() {
    return (
      <div className="f5 flex black br--top br3 o-70">
        { ITEMS.map((name, idx) => this.itemView(name, idx)) }
      </div>
    );
  }
}

const itemClasses = {
    active: "dib link ph3 pv2 b bb bw2 b--dark-green black pointer",
    inactive: "dim dib link ph3 pv2 f5 black pointer",
}
