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

  const getCoverUrl = (isbn) =>
    isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : defaultCover

  const isImageBlank = (imgElement) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = imgElement.width
      canvas.height = imgElement.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(imgElement, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      let whitePixels = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        if (r > 240 && g > 240 && b > 240) {
          whitePixels++
        }
      }

      return whitePixels / (data.length / 4) > 0.95
    } catch (e) {
      return false
    }
  }

  const handleImageLoad = (e) => {
    if (isImageBlank(e.target)) {
      showNoCover(e.target)
    }
  }

  const showNoCover = (imgElement) => {
    if (imgElement) {
      imgElement.style.display = 'none'
      if (imgElement.nextElementSibling) {
        imgElement.nextElementSibling.style.display = 'flex'
      }
    }
  }

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
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              onError={(e) => showNoCover(e.target)}
            />
            <div className="no-cover" style={{ display: 'none' }}>
              <FaBook />
              <p>No Cover Available</p>
            </div>
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
