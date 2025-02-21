import React, { useState, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [filteredResults, setFilteredResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef(null)

  const navigate = useNavigate()

  const fetchPage = async (searchTerm, page) => {
    try {
      const response = await axios.get(
        `http://countmein.pythonanywhere.com/api/v1/marc/search/?page=${page}&search=${searchTerm}`
      )
      console.log(`Fetched page ${page}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error)
      return null
    }
  }

  const searchBooks = async (value) => {
    if (!value?.trim()) {
      console.log('Empty search value, clearing results')
      setFilteredResults([])
      setShowDropdown(false)
      return
    }

    setLoading(true)
    console.log('Starting search for:', value)

    try {
      let allResults = []
      let currentPage = 1
      let hasNextPage = true

      while (hasNextPage) {
        const pageData = await fetchPage(value, currentPage)
        if (!pageData || !pageData.results) {
          break
        }

        allResults = [...allResults, ...pageData.results]
        console.log(`Accumulated ${allResults.length} results so far`)

        hasNextPage = pageData.next !== null
        currentPage += 1
      }

      console.log('Total results fetched:', allResults.length)
      setFilteredResults(allResults)
      setShowDropdown(true)
    } catch (error) {
      console.error('Search error:', error)
      setFilteredResults([])
    } finally {
      setLoading(false)
      console.log('Search completed')
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    setSelectedIndex(-1) // Reset selection on new search
    searchBooks(value)
  }

  const scrollToItem = (index) => {
    if (!dropdownRef.current) return
    const dropdown = dropdownRef.current
    const items = dropdown.getElementsByClassName('dropdown-item')
    if (items[index]) {
      items[index].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => {
          const newIndex = prev < filteredResults.length - 1 ? prev + 1 : prev
          scrollToItem(newIndex)
          return newIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : -1
          scrollToItem(newIndex)
          return newIndex
        })
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleItemClick(filteredResults[selectedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleItemClick = (item) => {
    navigate(`/book/${item.id}`)
  }

  return (
    <div className="container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search books..."
          value={searchValue}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <FaSearch className="search-icon" />
        {loading && <div className="loading-indicator">Searching...</div>}
        {showDropdown && filteredResults.length > 0 && (
          <div className="search-dropdown" ref={dropdownRef}>
            {filteredResults.map((item, index) => (
              <div
                key={index}
                className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="book-title">{item.title}</div>
                <div className="book-details">
                  <span>Author: {item.author}</span>
                  <span>ISBN: {item.isbn}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
