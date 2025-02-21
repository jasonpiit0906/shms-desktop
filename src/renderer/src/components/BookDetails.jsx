import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import '../styles/BookDetails.css'
import defaultCover from '../assets/default-book-cover.svg'

function BookDetails() {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  const getCoverUrl = (isbn) => {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
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
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="book-details-container">
      {book?.isbn && (
        <div
          className="background-image"
          style={{ backgroundImage: `url(${getCoverUrl(book.isbn)})` }}
        />
      )}

      <div className="content-overlay">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Search
        </button>

        <div className="book-details-content">
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

          <div className="book-info">
            <h1>{book?.title}</h1>
            <h2>By {book?.author}</h2>

            <div className="book-metadata">
              <div className="metadata-section">
                <h3>Publication Details</h3>
                {book?.publisher && (
                  <p>
                    <strong>Publisher:</strong> {book.publisher}
                  </p>
                )}
                {book?.place_of_publication && (
                  <p>
                    <strong>Place of Publication:</strong> {book.place_of_publication}
                  </p>
                )}
                {book?.year && (
                  <p>
                    <strong>Year:</strong> {book.year}
                  </p>
                )}
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
                {book?.physical_description && (
                  <p>
                    <strong>Physical Description:</strong> {book.physical_description}
                  </p>
                )}
              </div>

              <div className="metadata-section">
                <h3>Identifiers</h3>
                {book?.isbn && (
                  <p>
                    <strong>ISBN:</strong> {book.isbn}
                  </p>
                )}
                {book?.accession_number && (
                  <p>
                    <strong>Accession Number:</strong> {book.accession_number}
                  </p>
                )}
                {book?.barcode && (
                  <p>
                    <strong>Barcode:</strong> {book.barcode}
                  </p>
                )}
              </div>

              <div className="metadata-section">
                <h3>Library Information</h3>
                {book?.status && (
                  <p>
                    <strong>Status:</strong> {book.status}
                  </p>
                )}
                {book?.date_received && (
                  <p>
                    <strong>Date Received:</strong>{' '}
                    {new Date(book.date_received).toLocaleDateString()}
                  </p>
                )}
                {book?.date_processed && (
                  <p>
                    <strong>Date Processed:</strong>{' '}
                    {new Date(book.date_processed).toLocaleDateString()}
                  </p>
                )}
                {book?.subject && (
                  <p>
                    <strong>Subject:</strong> {book.subject}
                  </p>
                )}
              </div>

              {book?.series_title && (
                <div className="metadata-section">
                  <h3>Series Information</h3>
                  <p>
                    <strong>Series Title:</strong> {book.series_title}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
