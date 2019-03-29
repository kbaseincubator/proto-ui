import {Component, h} from 'preact';

// Generic search input
export class SearchInput extends Component {
  static createState() {
    return {value: ''};
  }

  setVal(ev) {
    if (!this.props.handleUpdate) {
      return;
    }
    const value = ev.currentTarget.value.trim();
    this.props.handleUpdate((state) => {
      return Object.assign(state, {value});
    });
    if (this.props.onSearch) {
      this.props.onSearch(value);
    }
  }

  render() {
    return (
      <div className='relative'>
        <i className='fas fa-search black-30 absolute'
          style={{top: '0.65rem', left: '0.5rem'}}></i>
        <input
          className='w5-l pa2 br2 ba b--solid b--black-20'
          type='text'
          placeholder='Search'
          onInput={(ev) => this.setVal(ev)}
          style={{paddingLeft: '2rem'}} />
      </div>
    );
  }
}
