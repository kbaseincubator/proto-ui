/**
 * Input field with validation 
 */

import React, { Component } from 'react';


interface Props {
  disabled?: boolean;
  hidden?: boolean;
  form?: string;
  list?: string;
  name?: string;
  placeholder?: string
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  maxLength?: number;
  minLength?: number;
  value?: string;
  id?: string;
  validation?: boolean;
  onPressEnter?: () => void;
  onChange?: () => void;
};

interface State {
  inputValue?: string | undefined;
  validateStatus?: "" | "error" | "success" | "warning" | "validating" | null;
  requiredNotification?: boolean | null;
  helpText?: string;
}

class NumInput extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: undefined,
      validateStatus: null,
      requiredNotification: null
    };
  }
  componentDidMount() {

  }
  checkforE(ev:any){
    console.log(ev.charCode, ev.keyCode, this.state)
    if(ev.charCode === 101){
        this.setState({validateStatus: 'error', helpText: 'Expecting numbers'})
    }
  }
  onChangeHandler(ev:any){
    console.log( ev.currentTarget, ev.charCode)
    let inputValue:string = ev.currentTarget.value;
    // this.props.onChange
    if(typeof inputValue === 'string'){
      this.setState({inputValue});
    }
    if(this.props.validation){
      this.validateInput(inputValue)
    }
  }
  /**
   * Validate value against 
   *  - max and min length
   *  - if it's a required field
   *  - input type 
   * and set state per validation result.
   * @param inputValue 
   */
  validateInput(inputValue: string) {
    if (isNaN(parseInt(inputValue, 10)) || inputValue === 'e') {
        this.setState({ validateStatus: 'error', helpText: 'Expecting numbers' });
        return;
    }
    // check against min and max length
    // this could be dobe by ternary operator, but typescript doesn't like it.
    let maxLength: number;
    if (typeof this.props.maxLength !== 'undefined') {
      maxLength = this.props.maxLength;
    } else {
      maxLength = 10000; // number is picked randomly. Number.MAX_SAFE_INTEGER seemed a bit overkill.
    };

    let minLength: number;
    if (typeof this.props.minLength !== 'undefined') {
      minLength = this.props.minLength;
    } else {
      minLength = 2;
    };

    if (inputValue.length <= maxLength && inputValue.length >= minLength) {

      this.setState({ validateStatus: 'success', helpText: undefined});

    } else if (!this.props.required && inputValue.length === 0) {

      this.setState({ validateStatus: 'success', helpText: undefined});

    } else if (inputValue.length < minLength) {

      this.setState({ validateStatus: 'error', helpText: 'input must be at least ' + minLength + ' numbers' });

    } else if (inputValue.length > maxLength) {
      // this shouldn't happen since input field max length is set
      this.setState({ validateStatus: 'error', helpText: 'input must be less than ' + maxLength + ' numbers' });

    };
  };

  render() {
    return (
      <>
        <fieldset style={{ padding: '0.35em', margin: '0.5rem' }} className={this.state.validateStatus==='error' ? 'b--red' : ''}>
          <legend style={{
            fontSize: '10px',
            padding: '0',
            textAlign: 'left',
            transition: 'width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
            lineHeight: '12px',
          }}><span className='mh1 gray'>{this.props.required ? 'Required*' : 'Optional'}</span></legend>
          <input
            className="w-100 pa2 bn"
            type="number"
            onChange={this.onChangeHandler.bind(this)}
            disabled={this.props.disabled}
            hidden={this.props.hidden}
            form={this.props.form}
            list={this.props.list}
            name={this.props.name}
            placeholder={this.props.placeholder}
            required={this.props.required}
            readOnly={this.props.readOnly}
            defaultValue={this.props.defaultValue}
            value={this.state.inputValue}
            id={this.props.id}
            onKeyPress={this.checkforE.bind(this)}
          />
        </fieldset>
        <p className='f7 ml3 mr3 red'>{this.state.helpText}</p>
      </>
    )
  }
}

export default NumInput;