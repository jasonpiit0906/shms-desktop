import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import '../styles/BookDetails.css'
import defaultCover from '../assets/default-book-cover.svg'

function BookDetails() {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookSummary, setBookSummary] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  const getCoverUrl = (isbn) => {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
  }

  const fetchBookSummary = async (isbn) => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      )
      const bookData = response.data[`ISBN:${isbn}`]
      if (bookData && bookData.description) {
        setBookSummary(
          typeof bookData.description === 'object'
            ? bookData.description.value
            : bookData.description
        )
      }
    } catch (error) {
      console.error('Error fetching book summary:', error)
    }
  }

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://countmein.pythonanywhere.com/api/v1/marc/record/${id}/`
        )
        setBook(response.data)
        if (response.data?.isbn) {
          fetchBookSummary(response.data.isbn)
        }
      } catch (error) {
        console.error('Error fetching book details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [id])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="book-details-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Search
      </button>

      <div className="content-overlay">
        <div className="book-details-content">
          <div className="book-cover-section">
            <div className="book-cover">
              <img
                src={book?.isbn ? getCoverUrl(book.isbn) : defaultCover}
                alt={book?.title || 'Default Cover'}
                onError={(e) => {
                  e.target.src = defaultCover
                }}
              />
              <div className="status-badge">{book?.status}</div>
            </div>
            <div className="book-metadata-compact">
              {book?.series_title && (
                <p>
                  <strong>Series:</strong> {book.series_title}
                </p>
              )}
              <p>
                <strong>Publisher:</strong> {book?.publisher}
              </p>
              <p>
                <strong>Published:</strong> {book?.place_of_publication}, {book?.year}
              </p>
              {book?.edition && (
                <p>
                  <strong>Edition:</strong> {book.edition}
                </p>
              )}
              {book?.volume && (
                <p>
                  <strong>Volume:</strong> {book.volume}
                </p>
              )}
            </div>
          </div>

          <div className="book-title-section">
            <h1 className="book-main-title">{book?.title}</h1>
            <h2 className="book-author">by {book?.author}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
