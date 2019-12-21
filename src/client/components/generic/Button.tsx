import React, { Component } from 'react';

//TODO: Add other attributes
interface Props {
  innerText: string;
  backgoundColor?: string;
  onClick?: (arg0: any) => void;
}

export class Button extends Component<Props, any> {
  render() {
    let onClickHandler: (arg0: any) => void;
    if (this.props.onClick) {
      onClickHandler = this.props.onClick;
    }
    return (
      <button
        className="k-button"
        data-hl-nav="profile"
        onClick={event => onClickHandler(event)}
        style={{
          backgroundColor: this.props.backgoundColor
            ? this.props.backgoundColor
            : 'inherit',
        }}
      >
        {this.props.innerText}
      </button>
    );
  }
}
