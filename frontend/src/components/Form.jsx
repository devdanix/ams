import _ from 'lodash'
import React, { useState, useEffect } from 'react'

// Components
import Button from './Button.jsx';
import FormField from './FormField.jsx'

export default function Form(props) {

  const [state, setState] = useState('');
  let values = ''

  const handleOnChange = (event) => {
    let id = `${event.target.id}-label`
    if (event.target.value && event.target.type != 'radio') {
      document.getElementById(id).classList.add('not-empty')
    } else {
      document.getElementById(id).classList.remove('not-empty')
    }
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  }

  if (props.values){
    useEffect(() => {
      props.values.forEach(field => {
        if (field.value) {
          let inputField = document.getElementById(field.id)
          let inputFieldLabel = document.getElementById(`${field.id}-label`)
          inputField.value = field.value
          setState(prevState => ({ ...prevState, [field.name]: field.value }))
          if (field.type != 'radio' ){
            inputFieldLabel.classList.add('not-empty')
          }
        }
      })
    }, [])

    values = props.values.map(value => {
      let attrs = {};
      _.forIn(value.attributes, ( value , key) => {
        if(value) { attrs[key] = value }
      });

      return (
        <FormField
          key={value.label}
          attrs={attrs}
          onChange={handleOnChange}
          id={value.id}
          type={value.type}
          extraType={value.extraType}
          inputClassName={value.inputClassName}
          labelClassName={value.labelClassName}
          label={value.label}
          name={value.name}
          ref={value.ref}
        />
      )
    })
  }

  let buttons = props.buttons.map(button => {
    button.variables.forEach(element => {
      if (_.has(state, element)) {
        if (isNaN(state[element])) {
          button.param.variables[element] = state[element]
        } else {
          button.param.variables[element] = parseInt(state[element])
        }
      }
    })

    return (
      <Button
        key={button.label}
        className={button.className}
        label={button.label}
        function={button.function}
        variables={button.variables}
        param= {button.param}
        iconClassName=""
        icon=''
        style={button.style}
      />
    )
  })

  return (
    <form id={props.id} className="form-wrapper centered">
      <h2 className="form-title">{props.title}</h2>
      <p className="form-text">{props.formText}</p>
      {values}
      <div className='flex jcsb'>{buttons}</div>
      {props.extraInput}
    </form>
  )
}
