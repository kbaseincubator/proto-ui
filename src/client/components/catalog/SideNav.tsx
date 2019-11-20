import React, { Component } from 'react';

// Components

// Constants
const ITEMS = ['Apps', 'Modules', 'Data types', 'Services', 'Admin'];

// Parent page component for the dashboard page
export class SideNav extends Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  itemView(name: string) {
    return (
      <li>
        <a className="pointer db hover-bg-light-blue pa2 br1">
          {name}
        </a>
      </li>
    );
  }

  render() {
    return (
      <div className="">
        <ul className="list pa0">
          { ITEMS.map(i => this.itemView(i)) }
        </ul>
      </div>
    );
  }
}
