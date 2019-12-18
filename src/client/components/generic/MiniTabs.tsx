import React, { Component } from 'react';

interface Props {
  tabs: Array<string>;
  onSelect: (index: number) => void;
  className: string;
  activeIdx?: number;
}

interface State {}

// Small horizontal, in-page tab navigation.
export class MiniTabs extends Component<Props, State> {
  // Select a new tab by index
  select(idx: number) {
    if (idx === this.props.activeIdx) {
      return;
    }
    if (idx < 0 || idx >= this.props.tabs.length) {
      throw new Error(`Invalid tab index ${idx}. Min is 0
        and max is ${this.props.tabs.length - 1}.`);
    }
    if (this.props.onSelect) {
      this.props.onSelect(idx);
    }
  }

  render() {
    const { activeIdx, tabs } = this.props;
    const className =
      (this.props.className || '') + ' list pa0 ma0 flex items-center';
    return (
      <ul className={className} style={{ position: 'relative', top: '1px' }}>
        {tabs.map((tabText: string, idx: number) => {
          const className =
            activeIdx === idx ? tabClasses.active : tabClasses.inactive;
          return (
            <li
              key={tabText}
              className={className}
              onClick={() => this.select(idx)}
              style={{ userSelect: 'none' }}
            >
              {tabText}
            </li>
          );
        })}
      </ul>
    );
  }
}

// Active and inactive tab styles
const tabClasses = {
  active: 'mr2 dib pa2 bb b b--green bw2',
  inactive: 'mr2 dib pa2 pointer dim black-80',
};
