import React from 'react'
import { Link } from 'react-router-dom'


// Icons
import { BsCalendar3 } from 'react-icons/bs'
import { AiOutlineDashboard } from 'react-icons/ai'
import { FaRegBuilding, FaUser } from 'react-icons/fa'

export default function Navbar() {

  return (
    <nav className="nav">
      <ul className="nav-container">
        <div className="nav-menu">
          <li className="nav-logo nav-item">
            Logo
          </li>
          <li className="nav-item">
            <AiOutlineDashboard className=''/>
            <Link to="/">Dashboard</Link>
          </li>
          <li className="nav-item">
            <BsCalendar3 className='' />
            <Link to="/calendar">Calendar</Link>
          </li>
          <li className="nav-item">
            <FaRegBuilding className='' />
            <Link to="/companies">Companies</Link>
          </li>
          <li className="nav-item">
            <FaUser className='' />
            <Link to="/profile">Profile</Link>
          </li>
        </div>
        <div className="nav-footer"></div>
      </ul>
    </nav>
  )
}
