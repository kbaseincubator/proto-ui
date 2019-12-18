import React, { Component } from 'react';

//TODO: Add other attributes
interface Props {
  innerText: string;
  backgoundColor?: string;
  onClick?: (event: any) => void;
}

export class Button extends Component<Props, any> {
  render() {
    return (
      <button
        className="k-button"
        data-hl-nav="profile"
        onClick={event => this.props?.onClick(event)}
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
