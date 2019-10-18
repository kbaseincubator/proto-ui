import {Component, h} from 'preact';

/**
 * Horizontal tab navigation UI.
 * props:
 * - tabs - array of tab titles (default [])
 * state:
 * - selectedIdx - default selected index (default 0)
 * callbacks:
 * - onSelectTab - a new tab was selected
 */
export class TabHeader extends Component {
  constructor(props) {
    super(props);
    const selectedIdx = props.selectedIdx || 0;
    this.state = {
      tabs: props.tabs,
      selectedIdx,
    };
  }

  // Select a new tab to activate
  select(idx) {
    if (idx >= this.state.tabs.length || idx < 0) {
      throw Error(`Invalid tab index ${idx}. Max is ${this.state.tabs.length - 1} and min is 0.`);
    }
    this.setState({selectedIdx: idx});
    if (this.props.onSelectTab) {
      this.props.onSelectTab(idx, this.state.tabs[idx]);
    }
  }

  // Handle click event on a tab element
  handleClickTab(idx) {
    if (idx === this.state.selectedIdx) {
      // No-op if the tab is already selected
      return;
    }
    this.select(idx);
  }

  render(props) {
    const {tabs} = props;
    const {selectedIdx} = this.state;
    return (
      <div className='pt2'>
        <ul className='list pa0 ma0 flex items-center' style={{position: 'relative', top: '1px'}}>
          {
            tabs.map((tabText, idx) => {
              const className = selectedIdx === idx ? tabClasses.active : tabClasses.inactive;
              return (
                <li key={tabText} className={className}
                  onClick={() => this.handleClickTab(idx)}
                  style={{userSelect: 'none'}}>
                  {tabText}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

// Active and inactive tab styles using Tachyons classes
const tabClasses = {
  active: 'dib pv3 ph3 br--top br2 bt bl br b bg-light-gray b--black-20',
  inactive: 'dib pv3 pointer br--top br2 dim ph3 b--black-10 black-80',
};
