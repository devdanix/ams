import React from 'react'

export default function Button(props) {

  let funcParam = props.param && props.param.variables ? props.param.variables : props.funcParam

  if ( props.param.variables ) {
    props.variables.forEach(element => {
      if (!isNaN(funcParam[element]) && typeof(funcParam[element]) !== 'boolean') {
        funcParam[element] = parseInt(funcParam[element])
      }
    });
    funcParam = { variables : funcParam }
  }

  return (
    <div style={props.style}>
      <button
        key={props.label}
        type={props.type}
        className={props.className}
        disabled={props.disabled}
        onClick={
          props.function ?
          (event) => {
            event.preventDefault()
            props.function(funcParam)
          } :
          () => ''
        }>
          {props.children}
          {props.label}

      </button>
    </div>
  )
}
