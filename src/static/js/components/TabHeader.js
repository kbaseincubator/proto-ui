// Narrative list header with tabs
import {Component, h} from 'preact';

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
  static createState({tabs = [], selectedIdx = 0}) {
    return {selectedIdx, tabs};
  }

  // User clicks or taps a new tab
  select(idx) {
    if (!this.props.handleUpdate) {
      return;
    }
    this.props.handleUpdate((state) => {
      if (state.selectedIdx === idx) {
        return state;
      }
      if (this.props.onTabSelect) {
        this.props.onTabSelect(idx);
      }
      return Object.assign(state, {selectedIdx: idx});
    });
  }

  render() {
    const {tabs, selectedIdx} = this.props;
    return (
      <div className='pt2'>
        <ul className='list pa0 ma0 flex items-center' style={{position: 'relative', top: '1px'}}>
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
      </div>
    );
  }
}

// Active and inactive tab styles
const tabClasses = {
  active: 'dib pv3 ph3 br--top br2 bt bl br b bg-light-gray b--black-20',
  inactive: 'dib pv3 pointer br--top br2 dim ph3 b--black-10 black-80',
};

