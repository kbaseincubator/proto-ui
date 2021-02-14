import React from 'react';

interface Props {
  id: string;
  placeholder: string;
  handleInput: () => void;
  required?: boolean | null;
  defaultValue?: string | null;
}
export function Input(props: Props) {
  return (
    <input
      className="w5-l pa2 br2 ba b--solid b--black-20"
      type="text"
      id={props.id}
      placeholder={props.placeholder}
      onInput={props.handleInput}
      style={{ paddingLeft: '2rem' }}
    />
  );
}
