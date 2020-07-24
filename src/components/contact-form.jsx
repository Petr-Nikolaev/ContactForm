import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ContactField } from './contact-field';

export class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contactList: new Map(),
      // Just for present result of the getFormValues and convertArrayToObject
      changeValue: 0,
      changeType: 0,
    }
  }

  componentDidMount() {
    this.addField();
  }

  getFormValues = () => {
    const {contactList} = this.state;
    const values = {
      type: [],
      value: []
    };
    contactList.forEach(value => {
      values.type.push(value.type);
      values.value.push(value.value);
    });
    return values;
  }

  convertArrayToObject = () => {
    const values = this.getFormValues();
    let dataArray = [];
    if (values.type.length === values.value.length) {
      for (let index = 0; index < values.type.length; index++) {
        dataArray.push({
          "type": values.type[index],
          "value": values.value[index],
        })
      }
    }
    return dataArray;
  }

  addField = () => {
    const {contactList} = this.state;
    const id = uuidv4();
    const newContactList = contactList;
    newContactList.set(id, {id: id, type: '', value: '', validationError: ''});
    this.setState({contactList: newContactList});
  }

  removeField = (id) => {
    const {contactList} = this.state;
    if (contactList.size === 1) {
      return;
    }
    const newContactList = contactList;
    if(newContactList.delete(id)) {
      this.setState({contactList: newContactList});
    }
  }

  onSelectType = (type, id) => {
    const {contactList, changeType} = this.state;
    const contact = contactList.get(id);
    contact.type = type;
    // Just for present result of the getFormValues and convertArrayToObject
    let counter = changeType;
    this.setState({changeType: counter++});
  }

  onChangeValue = (value, id) => {
    const {contactList, changeValue} = this.state;
    const contact = contactList.get(id);
    contact.value = value;
    contact.validationError = '';
    if (!validation(contact.type, value)) {
      contact.validationError = `${contact.type} has incorrect value`;
    }
    // Just for present result of the getFormValues and convertArrayToObject
    let counter = changeValue;
    this.setState({changeValue: counter++});
  }

  renderContactField  = () => {
    const {contactList} = this.state;
    return (
      <>
        {Array.from(contactList).map(contact => {
          return <ContactField id={contact[0]} key={contact[0]}
            validationError={contact[1].validationError}
            addField={this.addField}
            removeField={this.removeField}
            onSelectType={this.onSelectType}
            onChangeValue={this.onChangeValue} />
        })}
      </>
    )
  }

  // Just for present result of the getFormValues
  renderFromValues = () => {
    const values = this.getFormValues();
    return (
      <>
        <div>
        type: [{values.type.map((type, index) =>
          <span key={`${index}-${type}`}>{type}{index === values.type.length - 1 ? '' : ', '}</span>)}]
        </div>
        <div>
        value: [{values.value.map((value, index) =>
          <span key={`${index}-${value}`}>{value}{index === values.value.length - 1 ? '' : ', '}</span>)}]
        </div>
      </>
    );
  }

  // Just for present result of the convertArrayToObject
  renderFromObjectsArray = () => {
    const objectsArray = this.convertArrayToObject();
    return (
      <>
        [{objectsArray.map((object, index) => {
          return <div key={`${index}-${object["value"]}`}>
            {`{"type": ${object["type"]}, "value": ${object["value"]}}`}
          </div>
        })}]
      </>
    );
  }

  render() {
    return (
      <div className='main'>
        <h4>Contact from</h4>
        <>
          {this.renderContactField()}
        </>
        {/* Just for present result of the convertArrayToObject */}
        <>
          <h4>Logger</h4>
          getFormValues: {this.renderFromValues()}
          <br/>
          convertArrayToObject: {this.renderFromObjectsArray()}
        </>
      </div>
    )
  }
}

function validation(type, value) {
  let isValid = true;
  switch(type) {
    case 'Email':
      const emailRegexp = /^[\w#][\w\.\'+#](.[\w\\'#]+)\@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)*(.[a-zA-Z]{2,20})$/;
      isValid = value.match(emailRegexp) === null ? false : true;
      break;
    case 'Phone':
      const phoneRegexp = /^\d{10}$/;
      isValid = value.match(phoneRegexp) === null ? false : true;
      break;
    case 'Link':
      const linkRegexp = /^(ftp|http|https):\/\/[^ "]+$/;
      isValid = value.match(linkRegexp) === null ? false : true;
      break;
    default: break;  
  }
  return isValid;
}