// Narrative list header with tabs
import {Component, h} from 'preact';
import mitt from 'mitt';

/**
 * Horizontal tab navigation above a section.
 *
 * State params:
 *   tabs - array of tab titles (default [])
 *   selectedIdx - default selected index (default 0)
 *
 * Callbacks:
 *   - onTabSelect(tabIDX)
 */
export class TabHeader extends Component {
  static createState({tabs = [], selectedIdx = 0, update}) {
    return {selectedIdx, tabs, update, emitter: mitt()};
  }

  // User clicks or taps a new tab
  static select(idx, state) {
    if (state.selectedIdx === idx) {
      return;
    }
    const newState = Object.assign(state, {selectedIdx: idx});
    state.update(newState);
    state.emitter.emit('tabSelected', newState);
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
                  onClick={() => TabHeader.select(idx, state)}
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

