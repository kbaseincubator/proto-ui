import React, { Component } from 'react';

interface Props {
  onSelect: (idx: number, val: string) => void;
  txt: string;
  items: string[];
  selectedIdx?: number;
  isOpen?: boolean;
  disabled?: boolean;
}

interface State {
  selectedIdx: number;
  isOpen: boolean;
}

// Filter dropdown component
export class FilterDropdown extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedIdx: props.selectedIdx || 0,
      isOpen: props.isOpen || false,
    };
  }

  // Callback function for use in clicking elsewhere in the document to
  // close the dropdown when it is open.
  docListener: null | ((ev: MouseEvent) => void) = null;

  // Add a document event handler to close the dropdown on click outside
  componentDidMount() {
    if (this.state.isOpen) {
      this.addDocumentClickListener();
    }
  }

  componentWillUnmount() {
    this.removeDocClickListener;
  }

  // Used in the componentDidMount document click event listener above
  handleDocumentClick(ev: MouseEvent) {
    const outsideDropdown = document.contains(ev.target as HTMLElement);
    if (outsideDropdown && this.state.isOpen) {
      this.setState({ isOpen: false });
      this.addOrRemoveDocClickListener();
      this.removeDocClickListener();
    }
  }

  // Handle a click down to open or close the dropdown
  handleMouseDown(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    // TODO check if this works okay with touch screens
    if (ev.type === 'mousedown' && ev.button !== 0) {
      // No-op if the mouse button was not the main left-click
      return;
    }
    ev.preventDefault();
    if (this.props.disabled) {
      return;
    }
    this.addOrRemoveDocClickListener();
    this.setState({ isOpen: !this.state.isOpen });
  }

  addDocumentClickListener() {
    this.docListener = ev => this.handleDocumentClick(ev);
    document.addEventListener('click', this.docListener, false);
  }

  removeDocClickListener() {
    if (!this.docListener) {
      return;
    }
    document.removeEventListener('click', this.docListener);
    this.docListener = null;
  }

  addOrRemoveDocClickListener() {
    if (this.docListener) {
      this.removeDocClickListener();
    } else {
      this.addDocumentClickListener();
    }
  }

  // Select an item in the dropdown by value
  // Closes the dropdown
  selectItem(idx: number) {
    this.addOrRemoveDocClickListener();
    this.setState({
      selectedIdx: idx,
      isOpen: false,
    });
    if (this.props.onSelect) {
      this.props.onSelect(idx, this.props.items[idx]);
    }
  }

  // View for a single dropdown item
  itemView(item: string, idx: number) {
    let icon;
    if (this.state.selectedIdx === idx) {
      icon = (
        <i className="fa fa-check mr1 dib" style={{ width: '1.5rem' }}></i>
      );
    } else {
      icon = <span className="mr1 dib" style={{ width: '1.5rem' }}></span>;
    }
    return (
      <a
        className="db pa2 pointer hover-bg-blue hover-white"
        onClick={() => this.selectItem(idx)}
        key={item}
      >
        {icon}
        {item}
      </a>
    );
  }

  render() {
    const { items } = this.props;
    let dropdownItems;
    let selected = null;
    selected = items[this.state.selectedIdx];
    if (this.state.isOpen) {
      dropdownItems = (
        <div
          className="dib bg-light-gray ba b--black-20 shadow-3 br2"
          style={{
            position: 'absolute' as 'absolute',
            right: '0',
            top: '80%',
            zIndex: 1,
            width: '14rem',
          }}
        >
          {items.map((item, idx) => this.itemView(item, idx))}
        </div>
      );
    } else {
      dropdownItems = (
        <div></div> // display: none?
      );
    }
    const iconClass =
      'ml1 fa ' + (this.state.isOpen ? 'fa-caret-up' : 'fa-caret-down');
    return (
      <div className="dib relative">
        <a
          className="dim dib pa3 pointer"
          onClick={ev => this.handleMouseDown(ev)}
        >
          {this.props.txt + ': ' + selected}
          <i className={iconClass}></i>
        </a>
        {dropdownItems}{' '}
      </div>
    );
  }
}
