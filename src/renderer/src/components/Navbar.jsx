import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaSearch, FaHome } from 'react-icons/fa'
import '../styles/Navbar.css'
import logo from '../assets/logo.png'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <h2>E Library</h2>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <FaHome /> Home
        </Link>
        <Link
          to="/search"
          className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
        >
          <FaSearch /> Search
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
