// Filter dropdown component
import {Component, h} from 'preact';
import mitt from 'mitt';


// methods:
//  - selectItem (val) - select the value for the dropdown
// emits:
//  - selected (val)
export class FilterDropdown extends Component {
  static createState({txt, items, selected, isOpen = false, update}) {
    return {txt, items, selected, isOpen, update, emitter: mitt()};
  }

  // Add a document event handler to close the dropdown on click outside
  componentDidMount() {
    this.docListener = ev => this.handleDocumentClick(ev);
    document.addEventListener('click', this.docListener, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.docListener, false);
  }

  handleDocumentClick(ev) {
    // Check if we are clicking on this dropdown element (this.base)
    const withinDropdown = this.base.contains(ev.target);
    const state = this.props.state;
    if (!withinDropdown && state.isOpen) {
      const newState = Object.assign(state, {isOpen: false});
      state.update(newState);
    }
  }

  handleMouseDown(ev) {
    const state = this.props.state;
    if (ev.type === 'mousedown' && ev.button !== 0) return;
    ev.preventDefault();
    if (state.disabled) {
      return;
    }
    const isOpen = !state.isOpen;
    const newState = Object.assign(state, {isOpen});
    state.update(newState);
  }

  static selectItem(value, state) {
    const newState = Object.assign(state, {selected: value, isOpen: false});
    state.update(newState)
    state.emitter.emit('selected', value);
  }

  render() {
    const state = this.props.state;
    const {txt, selected, isOpen, items} = state;
    let dropdownItems = '';
    if (isOpen) {
      dropdownItems = (
        <div
          className='dib bg-light-gray ba b--black-20 shadow-3 br2'
          style={{position: 'absolute', right: '0', top: '80%', zIndex: '1', width: '14rem'}}>
          { items.map((i) => itemView(this, i)) }
        </div>
      );
    }
    let iconClass = 'ml1 fas ' + (isOpen ? 'fa-caret-up' : 'fa-caret-down');
    return (
      <div className='dib relative'>
        <a className='dim dib pa3 pointer'
          onClick={(ev) => this.handleMouseDown(ev)}>
          { txt }
          { selected ? ': ' + selected : '' }
          <i className={iconClass}></i>
        </a>
        {dropdownItems}
      </div>
    );
  }
}

// View for a single dropdown item
function itemView(component, item) {
  const state = component.props.state;
  const {selected} = state;
  let icon;
  if (selected === item) {
    icon = (<i className='fas fa-check mr1 dib' style={{width: '1.5rem'}}></i>);
  } else {
    icon = (<span className='mr1 dib' style={{width: '1.5rem'}}></span>);
  }
  return (
    <a className='db pa2 pointer hover-bg-blue hover-white'
      onClick={() => FilterDropdown.selectItem(item, state)}
      key={item}>
      {icon}
      {item}
    </a>
  );
}
