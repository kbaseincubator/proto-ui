// Filter dropdown component
import {Component, h} from 'preact';


export class FilterDropdown extends Component {
  static createState({txt, items, selected, isOpen = false}) {
    return {txt, selected, isOpen, items, mounted: false};
  }

  // Add a document event handler to close the dropdown on click outside
  componentDidMount() {
    document.addEventListener('click', (ev) => this.handleDocumentClick(ev), false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', (ev) => this.handleDocumentClick(ev), false);
    this.mounted = false;
  }

  handleDocumentClick(ev) {
    if (!this.props.handleUpdate) {
      return;
    }
    this.props.handleUpdate((state) => {
      const withinDropdown = this.base.contains(ev.target);
      if (!withinDropdown && state.isOpen) {
        return Object.assign(state, {isOpen: false});
      }
      return state;
    });
  }

  handleMouseDown(ev) {
    if (ev.type === 'mousedown' && ev.button !== 0) return;
    ev.stopPropagation();
    ev.preventDefault();
    if (!this.props.handleUpdate || this.props.disabled) {
      return;
    }
    this.props.handleUpdate((state) => {
      const isOpen = !state.isOpen;
      if (this.props.onToggle) {
        this.props.onToggle(isOpen);
      }
      return Object.assign(state, {isOpen});
    });
  }

  selectItem(value) {
    this.props.handleUpdate((state) => {
      return Object.assign(state, {
        selected: value,
        isOpen: false,
      });
    });
    if (this.onSortSelect) {
      this.onSortSelect(value);
    }
  }

  render() {
    const {txt, isOpen, items} = this.props;
    let dropdownItems = '';
    if (isOpen) {
      dropdownItems = (
        <div
          className='dib bg-light-gray ba b--black-20 shadow-3 br2'
          style={{position: 'absolute', right: '0', top: '100%', zIndex: '1', width: '14rem'}}>
          { items.map((i) => itemView(this, i)) }
        </div>
      );
    }
    return (
      <div className='dib relative'>
        <a className='dim dib pa3 pointer'
          onClick={(ev) => this.handleMouseDown(ev)}>
          { txt }
          <i className="ml1 fas fa-caret-down"></i>
        </a>
        {dropdownItems}
      </div>
    );
  }
}

// View for a single dropdown item
function itemView(component, item) {
  const {selected} = component.props;
  let icon;
  if (selected === item) {
    icon = (<i className='fas fa-check mr1 dib' style={{width: '1.5rem'}}></i>);
  } else {
    icon = (<span className='mr1 dib' style={{width: '1.5rem'}}></span>);
  }
  return (
    <a className='db pa2 pointer hover-bg-blue hover-white'
      onClick={() => component.selectItem(item)}
      key={item}>
      {icon}
      {item}
    </a>
  );
}
