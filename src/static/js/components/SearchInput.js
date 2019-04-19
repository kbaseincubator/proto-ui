import {Component, h} from 'preact';
import mitt from 'mitt';

// Generic search input
export class SearchInput extends Component {
  static createState({update}) {
    return {value: '', update, emitter: mitt()};
  }

  static setVal(value, state) {
    value = value.trim()
    const newState = Object.assign(state, {value});
    state.update(newState);
    state.emitter.emit('searched', value);
  }

  render(props) {
    const state = props.state;
    return (
      <div className='relative'>
        <i className='fas fa-search black-30 absolute'
          style={{top: '0.65rem', left: '0.5rem'}}></i>
        <input
          className='w5-l pa2 br2 ba b--solid b--black-20'
          type='text'
          placeholder='Search'
          onInput={(ev) => SearchInput.setVal(ev.currentTarget.value, state)}
          style={{paddingLeft: '2rem'}} />
      </div>
    );
  }
}
