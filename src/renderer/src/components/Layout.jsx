import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'
import logo from '../assets/logo.png'

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="layout">
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
      <main className="main-content-wrapper">{children}</main>
    </div>
  )
}

export default Layout
