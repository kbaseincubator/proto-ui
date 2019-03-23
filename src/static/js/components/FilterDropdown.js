// Filter dropdown component
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import React from 'react';


export class FilterDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
      isOpen: false
    }
    this.onSortSelect = props.onSortSelect;
    this.mounted = true;
  }

  componentDidMount() {
    document.addEventListener('click', ev => this.handleDocumentClick(ev), false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', ev => this.handleDocumentClick(ev), false);
    this.mounted = false;
  }

  handleDocumentClick(ev) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(ev.target)) { // eslint-disable-line
        if (this.state.isOpen) {
          this.setState({isOpen: false})
        }
      }
    }
  }

  handleMouseDown(ev) {
    if (ev.type === 'mousedown' && ev.button !== 0) return;
    ev.stopPropagation();
    ev.preventDefault();
    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  selectItem(value) {
    this.setState({selected: value, isOpen: false});
    if (this.onSortSelect) {
      this.onSortSelect(value);
    }
  }

  render() {
    let dropdownItems = '';
    const onClick = ev => {
      this.handleMouseDown(ev);
    }
    if (this.state.isOpen) {
      dropdownItems = (
        <div
          className='dib bg-light-gray ba b--black-20 shadow-3 br2'
          style={{position: 'absolute', right: '0', top: '100%', zIndex: '1', width: '14rem'}}>
          { this.props.items.map(i => itemView(this, i)) }
        </div>
      );
    }
    return (
      <div className='dib relative'>
        <a className='dim dib pa3 pointer'
          onClick={onClick}>
          { this.props.txt }
          <i className="ml1 fas fa-caret-down"></i>
        </a>
        {dropdownItems}
      </div>
    );
  }
}

// View for a single dropdown item
function itemView (dropdown, item) {
  const onClick = () => {
    dropdown.selectItem(item);
  }
  let icon;
  if (dropdown.state.selected === item) {
    icon = (<i className='fas fa-check mr1 dib' style={{width: '1.5rem'}}></i>);
  } else {
    icon = (<span className='mr1 dib' style={{width: '1.5rem'}}></span>);
  }
  return (
    <a className='db pa2 pointer hover-bg-blue hover-white'
       onClick={onClick}
       key={item}>
      {icon}
      {item}
    </a>
  );
}

FilterDropdown.propTypes = {
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  txt: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
  onSortSelect: PropTypes.func
}
