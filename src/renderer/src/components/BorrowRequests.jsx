import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Skeleton from './Skeleton'
import '../styles/BorrowRequests.css'
import defaultCover from '../assets/default-book-cover.svg'

function BorrowRequests() {
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getCoverUrl = (isbn) =>
    isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : defaultCover

  useEffect(() => {
    const fetchAllBooks = async () => {
      setLoading(true)
      try {
        // Get first page to get total count
        const firstPage = await axios.get('http://countmein.pythonanywhere.com/api/v1/marc/search/')
        const totalPages = Math.ceil(firstPage.data.count / 10)

        // Fetch all pages concurrently
        const pagePromises = Array.from({ length: totalPages }, (_, i) =>
          axios.get(`http://countmein.pythonanywhere.com/api/v1/marc/search/?page=${i + 1}`)
        )

        const responses = await Promise.all(pagePromises)
        const allBooks = responses.flatMap((response) => response.data.results)
        setAllBooks(allBooks)
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllBooks()
  }, [])

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`)
  }

  const renderSkeletonLoading = () => (
    <div className="borrow-requests-container">
      <h1>Loading Books Collection...</h1>
      <div className="skeleton-grid">
        {[...Array(24)].map((_, index) => (
          <Skeleton key={index} type="card" />
        ))}
      </div>
    </div>
  )

  if (loading) return renderSkeletonLoading()

  return (
    <div className="borrow-requests-container">
      <h1>All Books Collection</h1>
      <div className="requests-grid">
        {allBooks.map((book, index) => (
          <div
            key={book.id}
            className="book-request-card"
            onClick={() => handleBookClick(book.id)}
            style={{ '--i': index }} // Add custom property for delay calculation
          >
            <img
              src={getCoverUrl(book.isbn)}
              alt={book.title}
              loading="lazy"
              onError={(e) => (e.target.src = defaultCover)}
            />
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">By {book.author}</p>
              <p className="isbn">ISBN: {book.isbn || 'N/A'}</p>
              <div className={`status ${book.status.toLowerCase()}`}>{book.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BorrowRequests
