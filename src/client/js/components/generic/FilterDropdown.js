import {Component, h} from 'preact';


/* Filter dropdown component
 * methods:
 * - selectItem (val) - select the value for the dropdown
 * callbacks:
 * - selected (val)
 */
export class FilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txt: props.txt,
      items: props.items,
      selected: props.selected,
      isOpen: props.isOpen || false,
      disabled: props.disabled || false,
    };
  }

  // Add a document event handler to close the dropdown on click outside
  componentDidMount() {
    this.docListener = (ev) => this.handleDocumentClick(ev);
    document.addEventListener('click', this.docListener, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.docListener, false);
  }

  // Used in the componentDidMount document click event listener above
  handleDocumentClick(ev) {
    // Check if we are clicking on this dropdown element (this.base)
    const withinDropdown = this.base.contains(ev.target);
    if (!withinDropdown && this.state.isOpen) {
      this.updateState({isOpen: false});
    }
  }

  // Handle a click down to open or close the dropdown
  handleMouseDown(ev) {
    // TODO check if this works okay with touch screens
    if (ev.type === 'mousedown' && ev.button !== 0) {
      // No-op if the mouse button was not the main left-click
      return;
    }
    ev.preventDefault();
    if (this.state.disabled) {
      return;
    }
    this.setState({isOpen: !this.state.isOpen});
  }

  // Select an item in the dropdown by value
  // Closes the dropdown
  selectItem(value) {
    this.setState({
      selected: value,
      isOpen: false,
    });
    if (this.props.onSelect) {
      this.props.onSelect(this.state);
    }
  }

  render(props) {
    const {txt, selected, isOpen, items} = this.state;
    let dropdownItems = '';
    if (isOpen) {
      dropdownItems = (
        <div
          className='dib bg-light-gray ba b--black-20 shadow-3 br2'
          style={{position: 'absolute', right: '0', top: '80%', zIndex: '1', width: '14rem'}} >
          { items.map((i) => itemView(this, i)) }
        </div>
      );
    }
    const iconClass = 'ml1 fas ' + (isOpen ? 'fa-caret-up' : 'fa-caret-down');
    return (
      <div className='dib relative'>
        <a className='dim dib pa3 pointer'
          onClick={(ev) => this.handleMouseDown(ev)}>
          { txt }
          { selected ? ': ' + selected : '' }
          <i className={iconClass}></i>
        </a>
        {dropdownItems} </div>
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
