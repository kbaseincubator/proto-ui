// NPM
import {Component, h} from 'preact';

// Milliseconds to wait before calling the "setVal" method and "onSetVal"
// callback
const DEBOUNCE = 250;

/**
 * Generic search text input with a loading state
 * props:
 * - loading - bool - whether to show a loading spinner
 * state:
 * - value - str - input value
 * callbacks:
 * - onSetVal(str) - called when the input value is set, at most every DEBOUNCEms
 */
export class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  setVal(value) {
    this.setState({value});
    if (this.props.onSetVal) {
      this.props.onSetVal(value);
    }
  }

  // From an input event, call setVal at most every DEBOUNCE milliseconds
  handleInput(ev) {
    const value = ev.currentTarget.value.trim();
    const callback = () => {
      this.setVal(value);
    };
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(callback, DEBOUNCE);
  }

  render(props) {
    let iconClass = 'fas fa-search black-30 absolute';
    if (props.loading) {
      iconClass = 'fas fa-cog fa-spin black-50 absolute';
    }
    return (
      <div className='relative'>
        <i className={iconClass} style={{top: '0.65rem', left: '0.5rem'}}></i>
        <input
          className='w5-l pa2 br2 ba b--solid b--black-20'
          type='text'
          placeholder='Search'
          value={this.state.value}
          onInput={this.handleInput.bind(this)}
          style={{paddingLeft: '2rem'}} />
      </div>
    );
  }
}
