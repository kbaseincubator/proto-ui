// Small version of horizontal, top tabs
import {Component, h} from 'preact';

export class MiniTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: props.selectedIdx || 0,
    };
  }

  // Select a new tab by index
  select(idx) {
    if (idx == this.state.selectedIdx) {
      return;
    }
    if (idx < 0 || idx >= this.props.tabs.length) {
      throw new Error(`Invalid tab index ${idx}. Min is 0
        and max is ${this.props.tabs.length - 1}.`);
    }
    this.setState({selectedIdx: idx});
    if (this.props.onSelect) {
      this.props.onSelect(idx);
    }
  }

  render() {
    const state = this.props.state;
    const {tabs, selectedIdx} = state;
    const className = (this.props.className || '') + ' list pa0 ma0 flex items-center';
    return (
      <ul className={className} style={{position: 'relative', top: '1px'}}>
        {
          tabs.map((tabText, idx) => {
            const className = selectedIdx === idx ? tabClasses.active : tabClasses.inactive;
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
