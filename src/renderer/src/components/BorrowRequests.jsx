import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/BorrowRequests.css'
import defaultCover from '../assets/default-book-cover.svg'

function BorrowRequests() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate()

  const getCoverUrl = (isbn) =>
    isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : defaultCover

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://countmein.pythonanywhere.com/api/v1/marc/search/?page=${currentPage}`
        )
        setBooks(response.data.results)
        // Calculate total pages based on count (assuming 10 items per page)
        setTotalPages(Math.ceil(response.data.count / 10))
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`)
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    )
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="borrow-requests-container">
      <h1>All Books Collection</h1>
      <div className="requests-grid">
        {books.map((book) => (
          <div key={book.id} className="book-request-card" onClick={() => handleBookClick(book.id)}>
            <img
              src={getCoverUrl(book.isbn)}
              alt={book.title}
              loading="lazy"
              onError={(e) => (e.target.src = defaultCover)}
            />
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">By {book.author}</p>
              <p className="isbn">{book.isbn}</p>
              <div className={`status ${book.status.toLowerCase()}`}>{book.status}</div>
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
    </div>
  )
}

export default BorrowRequests
