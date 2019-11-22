import React, { Component } from 'react';

// Milliseconds to wait before calling the "setVal" method and "onSetVal"
// callback
const DEBOUNCE = 250;

interface Props {
  onSetVal: (value: string) => void;
  loading: boolean;
}

interface State {
  value: string;
}

// Generic search text input with a loading state
export class SearchInput extends Component<Props, State> {
  // Used for debouncing the search input while typing
  timeout: number | null = null;
  inputID: string;

  constructor(props: Props) {
    super(props);
    this.inputID = 'search-input' + String(Math.floor(Math.random() * 1000000));
    this.state = {
      // value: props.value || '', <-- react doesn't like this
      value: '',
    };
  }

  setVal(value: string) {
    this.setState({ value });
    if (this.props.onSetVal) {
      this.props.onSetVal(value);
    }
  }

  // From an input event, call setVal at most every DEBOUNCE milliseconds
  handleInput(ev: React.FormEvent<HTMLInputElement>) {
    const value = ev.currentTarget.value.trim();
    const callback = () => {
      this.setVal(value);
    };
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = window.setTimeout(callback, DEBOUNCE);
  }

  render() {
    let iconClass = 'fa fa-search black-30 absolute';
    if (this.props.loading) {
      iconClass = 'fa fa-cog fa-spin black-50 absolute';
    }
    return (
      <div className="relative">
        <i className={iconClass} style={{ top: '0.65rem', left: '0.5rem' }}></i>
        <label htmlFor={this.inputID} className="dn">
          Search
        </label>
        <input
          className="w5-l pa2 br2 ba b--solid b--black-20"
          type="text"
          id={this.inputID}
          placeholder="Search"
          onInput={this.handleInput.bind(this)}
          style={{ paddingLeft: '2rem' }}
        />
      </div>
    );
  }
}
