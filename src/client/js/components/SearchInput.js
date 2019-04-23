import {Component, h} from 'preact';
import mitt from 'mitt';

// Generic search text input
// Has a loading state with spinner
// methods:
//  - setVal
//  - toggleLoading
// events:
//  - searched - user has entered a search query
export class SearchInput extends Component {
  static createState({update}) {
    return {value: '', update, loading: false, emitter: mitt()};
  }

  static setVal(value, state) {
    state.update(Object.assign(state, {value}));
  }

  static toggleLoading(state) {
    state.update(Object.assign(state, {loading: !state.loading}));
  }

  // With a debounce, call setVal on the input even
  handleInput(ev) {
    const state = this.props.state;
    const value = ev.currentTarget.value.trim();
    const callback = () => {
      SearchInput.setVal(value, state);
      state.emitter.emit('searched', value);
    };
    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.timeout = setTimeout(callback, 250);
  }

  render(props) {
    const state = props.state;
    let iconClass = 'fas fa-search black-30 absolute';
    // let loadingText = '';
    if (state.loading) {
      iconClass = 'fas fa-cog fa-spin black-50 absolute';
      /*
      loadingText = (
        <span className='black-60 ml2'> Loading... </span>
      );
      */
    }
    return (
      <div className='relative'>
        <i className={iconClass} style={{top: '0.65rem', left: '0.5rem'}}></i>
        <input
          className='w5-l pa2 br2 ba b--solid b--black-20'
          type='text'
          placeholder='Search'
          onInput={(ev) => this.handleInput(ev)}
          style={{paddingLeft: '2rem'}} />
        {/* loadingText */}
      </div>
    );
  }
}
