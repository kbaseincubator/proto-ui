import React, { Component } from 'react';

interface Props {
  innerText: string;
  onClick: (event: any) => void;
}

export class Button extends Component<Props, any> {
  render() {
    return (
      <button
        data-hl-nav="profile"
        style={ButtonStyle}
        onClick={event => this.props.onClick(event)}
      >
        {this.props.innerText}
      </button>
    );
  }
}
// Active and inactive tab styles
const ButtonStyle: React.CSSProperties = {
  color: 'rgba(0, 0, 0, 0.87)',
  boxShadow:
    '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
  backgroundColor: '#e0e0e0',
  padding: '6px 16px',
  fontSize: '0.875rem',
  minWidth: '64px',
  transition:
    'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  lineHeight: '1.75',
  borderRadius: '4px',
  letterSpacing: '0.02857em',
};
