import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

// Components
import Button from './Button.jsx'

export default function Dropdown({
  id = '',
  dropdownLinks = [],
  children = ''
}) {

  const showDropDown = (id) => {
    document.getElementById(id).classList.toggle("show");
    setTimeout(() => {
      document.getElementById(id).classList.remove("show");
    }, 3000)
  }

  const links = dropdownLinks.map(link => {
    return (
      <li key={link.label} className="dropdown-item">
        <a href={link.to} onClick={() => link.function()}>{link.label}</a>
      </li>
    )
  })

  return (
    <div className="dropdown">
      <Button
        function={showDropDown}
        funcParam={id}
        className="dropbtn"
        iconClassName=''
        icon=''
        variables=''
        param=''
      >
        <FaUserCircle size='2em' color='#fff'/>
      </Button>
      <div id={id} className="dropdown-content">
        <ul>
          {links}
        </ul>
        {children}
      </div>
    </div>
  )
}
