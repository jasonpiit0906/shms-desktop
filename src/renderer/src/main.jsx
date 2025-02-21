import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import BookDetails from './components/BookDetails'
import './App.css' // Make sure this is your main app styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  </React.StrictMode>
)
