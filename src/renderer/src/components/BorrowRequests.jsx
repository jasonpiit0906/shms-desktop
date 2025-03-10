import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Skeleton from './Skeleton'
import '../styles/BorrowRequests.css'
import defaultCover from '../assets/default-book-cover.svg'
import { FaBook } from 'react-icons/fa' // Add this import at the top with other imports

function BorrowRequests() {
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllBooks = async () => {
      setLoading(true)
      try {
        const firstPage = await axios.get('http://countmein.pythonanywhere.com/api/v1/marc/search/')
        const totalPages = Math.ceil(firstPage.data.count / 10)

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

  const getSecureImageUrl = (url) => {
    if (!url) return null
    // Convert HTTP to HTTPS
    return url.replace('http://', 'https://')
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
            style={{ '--i': index }}
          >
            {book.book_cover ? (
              <img
                src={getSecureImageUrl(book.book_cover)}
                alt={book.title}
                loading="lazy"
                className="book-cover-image"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
            ) : (
              <div className="no-cover">
                <FaBook />
                <p>No Cover Available</p>
              </div>
            )}
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">By {book.author}</p>
              <p className="isbn">ISBN: {book.isbn || 'N/A'}</p>
              <div className={`status ${book.status.toLowerCase()}`}>{book.status}</div>
              <p className="series">{book.series_title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BorrowRequests
