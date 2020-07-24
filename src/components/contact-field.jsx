import React from 'react';

export class ContactField extends React.Component {
  onSelectType = (event) => {
    const type = event.target.value;
    if (!type) {
      return;
    }
    this.props.onSelectType(type, this.props.id);
  }

  onChangeValue = (event) => {
    const value = event.target.value;
    if (!value) {
      return;
    }
    this.props.onChangeValue(value, this.props.id);
  }

  addField = () => {
    this.props.addField();
  }

  removeField = () => {
    this.props.removeField(this.props.id);
  }

  render() {
    const {validationError} = this.props;
    return (
      <div>
        <select onChange={(event) => this.onSelectType(event)} defaultValue='default'>
          <option disabled value='default'>Select type</option>
          <option value='Email'>Email</option>
          <option value='Phone'>Phone</option>
          <option value='Link'>Link</option>
        </select>
        <input type="text" onChange={(event) => this.onChangeValue(event)} />
        <button onClick={() => this.addField()}>+</button>
        <button onClick={() => this.removeField()}>-</button>
        <div className='validation-error'>{validationError ? validationError : null}</div>
      </div>
    )
  }
}