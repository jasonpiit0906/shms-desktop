import React, { useState, useRef, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { fetchRecords } from '../api/api'
import '../App.css'
import '../styles/SearchPage.css'
import defaultCover from '../assets/default-book-cover.svg'

function SearchPage() {
  const [searchValue, setSearchValue] = useState('')
  const [filteredResults, setFilteredResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const fetchPage = async (searchTerm, page) => {
    try {
      const data = await fetchRecords(page, searchTerm)
      console.log(`Fetched page ${page}:`, data)
      return data
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error)
      return null
    }
  }

  const fetchAllBooks = async () => {
    setLoading(true)
    try {
      const data = await fetchRecords(1, '')
      console.log('Fetched all books:', data)
      setFilteredResults(data.results || [])
      setShowDropdown(true)
    } catch (error) {
      console.error('Error fetching all books:', error)
      setFilteredResults([])
    } finally {
      setLoading(false)
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

  const handleInputClick = () => {
    if (!showDropdown) {
      fetchAllBooks()
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    setSelectedIndex(-1) // Reset selection on new search
    if (value.trim()) {
      searchBooks(value)
    } else {
      fetchAllBooks() // Show all books when input is empty
    }
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

  const handleInputFocus = () => {
    if (!showDropdown) {
      fetchAllBooks()
    }
  }

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      !e.target.classList.contains('search-input')
    ) {
      setShowDropdown(false)
    }
  }

  // Add event listener for clicking outside
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const renderFloatingBooks = () => {
    const books = []
    for (let i = 0; i < 20; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${15 + Math.random() * 15}s`,
        opacity: 0.1 + Math.random() * 0.1
      }
      books.push(<div key={i} className="floating-book" style={style} />)
    }
    return books
  }

  return (
    <div className="search-page">
      <div className="floating-books">{renderFloatingBooks()}</div>
      <div className="search-container">
        <h1 className="search-title">Search Books</h1>
        <p className="search-subtitle">Search through our collection of books</p>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchValue}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            className="search-input"
          />
          {loading ? (
            <div className="loading-indicator">Searching...</div>
          ) : (
            <FaSearch className={`search-icon ${loading ? 'hidden' : ''}`} />
          )}
        </div>

        {showDropdown && filteredResults.length > 0 && (
          <div className="search-dropdown" ref={dropdownRef}>
            {filteredResults.map((item, index) => (
              <div
                key={index}
                className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                {item.book_cover ? (
                  <img
                    src={item.book_cover}
                    alt={item.title}
                    className="dropdown-item-cover"
                    onError={(e) => {
                      e.target.src = defaultCover
                    }}
                  />
                ) : (
                  <img
                    src={defaultCover}
                    alt="No cover available"
                    className="dropdown-item-cover"
                  />
                )}
                <div className="dropdown-item-info">
                  <div className="book-title">{item.title}</div>
                  <div className="book-details">
                    <span>Author: {item.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
