import React from 'react'
import Navbar from './Navbar'
import '../styles/Navbar.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content-wrapper">{children}</main>
    </div>
  )
}

export default Layout
