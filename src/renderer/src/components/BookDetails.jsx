import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import '../styles/BookDetails.css'
import defaultCover from '../assets/default-book-cover.svg'
import { fetchBookDetails } from '../api/api'

function BookDetails() {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const renderFloatingBooks = () => {
    const books = []
    for (let i = 0; i < 20; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${15 + Math.random() * 15}s`,
        opacity: 0.05 + Math.random() * 0.05
      }
      books.push(<div key={i} className="details-floating-book" style={style} />)
    }
    return books
  }

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        setLoading(true)
        const data = await fetchBookDetails(id)
        setBook(data)
      } catch (error) {
        console.error('Error fetching book details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      getBookDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="book-details-container">
        <div className="details-floating-books">{renderFloatingBooks()}</div>
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Search
        </button>

        <div className="loading-container">
          <div className="skeleton-left">
            <div className="skeleton skeleton-cover"></div>
            <div className="skeleton-metadata">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          </div>

          <div className="skeleton-right">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-author"></div>
            <div className="skeleton-metadata">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="book-details-container">
      <div className="details-floating-books">{renderFloatingBooks()}</div>
      <button className="back-button" onClick={() => navigate('/search')}>
        <FaArrowLeft /> Back to Search
      </button>

      <div className="content-overlay">
        <div className="book-details-content">
          <div className="book-cover-section">
            <div className="book-cover">
              <img
                src={!imageError && book?.book_cover ? book.book_cover : defaultCover}
                alt={book?.title || 'Default Cover'}
                onError={() => setImageError(true)}
              />
              <div className="status-badge">{book?.status}</div>
            </div>
            <div className="book-metadata-compact">
              <p>
                <strong>ISBN:</strong> {book?.isbn || 'N/A'}
              </p>
              <p>
                <strong>CopyRight:</strong> {book?.copies || 'N/A'}
              </p>
              {book?.call_number && (
                <p>
                  <strong>Call Number:</strong> {book.call_number || 'N/A'}
                </p>
              )}
              {book?.year && (
                <p>
                  <strong>Year:</strong> {book.year || 'N/A'}
                </p>
              )}
              {book?.volume && (
                <p>
                  <strong>Volume:</strong> {book.volume || 'N/A'}
                </p>
              )}
            </div>
          </div>

          <div className="book-title-section">
            <h1 className="book-main-title">{book?.title}</h1>
            <h2 className="book-author">by {book?.author}</h2>
            <div className="book-description">{book?.description}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
