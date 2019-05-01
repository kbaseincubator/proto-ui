// Small version of horizontal, top tabs
import {Component, h} from 'preact';
import mitt from 'mitt';

export class MiniTabs extends Component {
  static createState({update, tabs=[], selectedIdx}) {
    if (selectedIdx > (tabs.length - 1)) {
      throw new Error('Invalid default index for MiniTabs: ' + selectedIdx);
    }
    const state = {
      emitter: mitt(),
      update,
      tabs,
      selectedIdx,
      selected: tabs[selectedIdx],
    };
    return state;
  }

  static select(idx, state) {
    const newState = Object.assign(state, {
      selectedIdx: idx,
      selected: state.tabs[idx],
    });
    state.update(newState);
  }

  handleClickTab(idx) {
    const state = this.props.state;
    if (idx === state.selectedIdx) {
      return;
    }
    MiniTabs.select(idx, state);
    state.emitter.emit('tabSelected', state.tabs[idx]);
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
                onClick={() => this.handleClickTab(idx)}
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
