import React from 'react'

// Components
import Dropdown from './Dropdown.jsx';

export default function TopNavbar({
  setUserToken = f => f,
  viewTitle = ''
}) {

  const logout = () => {
    setUserToken('')
    window.location.replace("/")
  }

  const dropdownLinks = [
    {
      label: 'Profile',
      to: '#profile',
      function: ''
    },
    {
      label: 'Logout',
      to: '/',
      function: logout
    }
  ]

  return (
    <div className="top-navbar-wrapper">
      <div className="centered w-95 h-100 flex jcsb">
        <h2 className="top-navbar-title">{viewTitle}</h2>
        <ul className="func-list flex-1">
          <li className="">
            <Dropdown
              id='testid'
              iconClassName="account"
              dropdownLinks={dropdownLinks}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}
