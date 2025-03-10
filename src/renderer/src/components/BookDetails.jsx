import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import '../styles/BookDetails.css'
import defaultCover from '../assets/default-book-cover.svg'

function BookDetails() {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  // Remove or comment out the getCoverUrl function since we won't use it
  // const getCoverUrl = (isbn) => {
  //   return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
  // }

  const generateDescription = (book) => {
    if (!book) return ''

    let description = `${book.title} is a book written by ${book.author}`

    if (book.series_title) {
      description += `, part of the ${book.series_title} series`
    }

    description += `. This ${book.edition || 'first'} edition was published by ${book.publisher}`

    if (book.place_of_publication) {
      description += ` in ${book.place_of_publication}`
    }

    if (book.year) {
      description += `, ${book.year}`
    }

    if (book.volume) {
      description += `, as volume ${book.volume}`
    }

    description += `. ${book.description || ''}`

    return description
  }

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
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://countmein.pythonanywhere.com/api/v1/marc/record/${id}/`
        )
        setBook(response.data)
      } catch (error) {
        console.error('Error fetching book details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
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
                <strong>Accession No:</strong> {book?.accession_number || 'N/A'}
              </p>
              {book?.series_title && (
                <p>
                  <strong>Series:</strong> {book.series_title}
                </p>
              )}
              {book?.volume && (
                <p>
                  <strong>Volume:</strong> {book.volume}
                </p>
              )}
              {book?.physical_description && (
                <p>
                  <strong>Description:</strong> {book.physical_description}
                </p>
              )}
              {book?.subject && (
                <p>
                  <strong>Subject:</strong> {book.subject}
                </p>
              )}
              {book?.notes && (
                <p>
                  <strong>Notes:</strong> {book.notes}
                </p>
              )}
            </div>
          </div>

          <div className="book-title-section">
            <h1 className="book-main-title">{book?.title}</h1>
            <h2 className="book-author">by {book?.author}</h2>
            <div className="book-description">{generateDescription(book)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
