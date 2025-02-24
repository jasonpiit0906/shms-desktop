import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'
import logo from '../assets/logo.png' // Make sure to add your logo file

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link
          to="/search"
          className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
        >
          Search
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
