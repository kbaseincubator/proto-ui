// Narrative list header with tabs
import {Component, h} from 'preact';
import mitt from 'mitt';

/**
 * Horizontal tab navigation UI.
 *
 * params:
 *   tabs - array of tab titles (default [])
 *   selectedIdx - default selected index (default 0)
 * methods:
 *   select (idx) - activate a tab by index
 * events:
 *   tabSelected (name) - user activated a tab
 */
export class TabHeader extends Component {
  static createState({tabs = [], selectedIdx = 0, update}) {
    return {selectedIdx, tabs, update, emitter: mitt(), selected: tabs[selectedIdx]};
  }

  // Select a new tab to activate
  static select(idx, state) {
    const newState = Object.assign(state, {
      selectedIdx: idx,
      selected: state.tabs[idx],
    });
    state.update(newState);
  }

  // Handle click event on a tab element
  handleClickTab(idx) {
    const state = this.props.state;
    if (idx === state.selectedIdx) {
      return;
    }
    TabHeader.select(idx, state);
    state.emitter.emit('tabSelected', state.tabs[idx]);
  }

  render() {
    const state = this.props.state;
    const {tabs, selectedIdx} = state;
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

// Active and inactive tab styles
const tabClasses = {
  active: 'dib pv3 ph3 br--top br2 bt bl br b bg-light-gray b--black-20',
  inactive: 'dib pv3 pointer br--top br2 dim ph3 b--black-10 black-80',
};
