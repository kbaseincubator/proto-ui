import React from 'react';

interface Props {
  id?: string | null;
  placeholder?: string | null;
  handleInput?: () => void;
  required?: boolean | null;
  defaultValue?: string | null;
  maxLength?: number| null;
  minLength?: number| null;
  onPressEnter?: boolean | null; // when true, it updates store state
}

enum validateStatus {
  none,
  error,
  success,
  warning,
  validating
}
interface State {
  inputValue: string | null;
  validateStatus?: validateStatus | null;
  helpText: string | null;
  requiredNotification: boolean | null;
};

class Input extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
        inputValue: null,
        validateStatus: null,
        helpText: null,
        requiredNotification: null
    };

  };
  
  render(){
    return (
      <input
        className="w5-l pa2 br2 ba b--solid b--black-20"
        type="text"
        id={this.props.id}
        placeholder={this.props.placeholder}
        onInput={this.props.handleInput}
        style={{ paddingLeft: '2rem' }}
      />
    ) 
  ;}
}

export default Input