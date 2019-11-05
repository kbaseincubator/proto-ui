import React, {Component} from 'react';

interface Props {
  tabs:Array<string>;
  onSelect:(indx:number)=>void;
  className:string;
  activeIdx?:number;
}

interface State {
  activeIdx:number;
}

/**
 * Small horizontal, in-page tab navigation.
 * props:
 * - items - array of str - names of tabs
 * state:
 * - activeIdx - index of the currently active tab
 * callbacks:
 * - onSelect
 */
export class MiniTabs extends Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.state = {
      activeIdx: this.props.activeIdx || 0
    };
  }

  // Select a new tab by index
  select(idx:number) {
    if (idx == this.state.activeIdx) {
      return;
    }
    if (idx < 0 || idx >= this.props.tabs.length) {
      throw new Error(`Invalid tab index ${idx}. Min is 0
        and max is ${this.props.tabs.length - 1}.`);
    }
    this.setState({activeIdx: idx});
    if (this.props.onSelect) {
      this.props.onSelect(idx);
    }
  }

  render() {
    const {tabs} = this.props;
    const {activeIdx} = this.state;
    const className = (this.props.className || '') + ' list pa0 ma0 flex items-center';
    return (
      <ul className={className} style={{position: 'relative', top: '1px'}}>
        {
          tabs.map((tabText, idx) => {
            const className = activeIdx === idx ? tabClasses.active : tabClasses.inactive;
            return (
              <li key={tabText} className={className}
                onClick={() => this.select(idx)}
                style={{userSelect: 'none'}}>
                {tabText}
              </li>
            );
          })
        }
      </ul>
    );
  }
}

// Active and inactive tab styles
const tabClasses = {
  active: 'mr2 dib pa2 bb b b--green bw2',
  inactive: 'mr2 dib pa2 pointer dim black-80',
};
