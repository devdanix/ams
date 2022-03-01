import _ from 'lodash';
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';

// Components


export default function ModalWindow(props) {

  const [ state, setState ] = useState('')


  const handleOnChange = (event) => {
    const { id, value } = event.target;
    let inputLabel = `${event.target.id}-label`
    if (event.target.value && event.target.type != 'radio') {
      document.getElementById(inputLabel).classList.add('not-empty')
    } else {
      document.getElementById(inputLabel).classList.remove('not-empty')
    }
    setState(prevState => ({ ...prevState, [id]: value }));
  }

  const clearForm = (formID) => {
    let formElements = document.getElementById(formID).elements
    let field_type
    _.forEach(formElements, elem => {
      field_type = elem.type.toLowerCase();
      switch (field_type) {
        case "text":
        case "password":
        case "textarea":
        case "hidden":
            elem.value = "";
            break;
        case "radio":
        case "checkbox":
            if (elem.checked) elem.checked = false;
            break;
        case "select-one":
        case "select-multi":
            elem.selectedIndex = -1;
            break;
        default:
            break;
      }
    })
  }

  const openWindow = () => {
    document.getElementById('modalWindow').style.display = "block";
    props.clearForm ? clearForm(props.children.props.id) : ''
  }

  useEffect(() => {
    openWindow()
    document.getElementById('startDate').setAttribute('label', 'startDate')
    document.getElementById('startDate-label').classList.add('not-empty')
  },[])

  const closeWindow = () => {
    const elem = document.querySelector('#modalWindowContainer');
    ReactDOM.unmountComponentAtNode(elem)
  }

  return (
    <div>
      <div id="modalWindow" className="modal">
        <div className="modal-content">
          {props.showCloseBtn ?
            <span className="close" onClick={closeWindow}>&times;</span> :
            ''
          }
          {props.children}
        </div>
      </div>
    </div>
  )
}
