import React, { useState, useEffect } from 'react'
import { FaStar, FaBook } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Homepage.css'
import '../styles/Navbar.css'
import defaultCover from '../assets/default-book-cover.svg'
import Skeleton from './Skeleton'

function Homepage() {
  const [featuredBook, setFeaturedBook] = useState(null)
  const [popularBooks, setPopularBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingImages, setLoadingImages] = useState({})
  const navigate = useNavigate()

  // Remove or comment out the getCoverUrl function
  // const getCoverUrl = (isbn) => {
  //   return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
  // }

  useEffect(() => {
    const fetchRecentBooks = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://countmein.pythonanywhere.com/api/v1/marc/search/')
        const books = response.data.results.map((book) => ({
          ...book,
          cover: book.book_cover || defaultCover
        }))

        // Set the first book as featured
        if (books.length > 0) {
          setFeaturedBook({
            ...books[0],
            coverImage: books[0].book_cover || defaultCover,
            rating: 4 // You can adjust this or make it dynamic
          })
        }

        setPopularBooks(books) // Fixed: Using setPopularBooks instead of setRecentBooks
      } catch (error) {
        console.error('Error fetching recent books:', error)
        setPopularBooks([]) // Fixed: Using setPopularBooks instead of setRecentBooks
      } finally {
        setLoading(false)
      }
    }

    fetchRecentBooks()
  }, [])

  const generateDescription = (book) => {
    if (!book) return ''
    let description = `${book.title} is a book written by ${book.author}`

    if (book.series_title) {
      description += `, part of the ${book.series_title} series`
    }

    if (book.publisher) {
      description += `. This ${book.edition || 'first'} edition was published by ${book.publisher}`
    }

    if (book.place_of_publication) {
      description += ` in ${book.place_of_publication}`
    }

    if (book.year) {
      description += `, ${book.year}`
    }

    return description
  }

  const renderStars = (rating) =>
    [...Array(5)].map((_, index) => (
      <FaStar key={index} className={index < rating ? 'star-filled' : 'star-empty'} />
    ))

  const handleBorrowRequest = () => {
    navigate('/borrow-requests')
  }

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`)
  }

  const handleImageLoad = (id, imgElement) => {
    const isWhiteCover = isImageBlank(imgElement)
    if (isWhiteCover) {
      handleImageError(id, imgElement)
    } else {
      setLoadingImages((prev) => ({
        ...prev,
        [id]: false
      }))
    }
  }

  // Add this new function to detect blank/white covers
  const isImageBlank = (imgElement) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = imgElement.width
      canvas.height = imgElement.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(imgElement, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Check if the image is predominantly white
      let whitePixels = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        if (r > 240 && g > 240 && b > 240) {
          whitePixels++
        }
      }

      return whitePixels / (data.length / 4) > 0.95 // If 95% of pixels are white
    } catch (e) {
      return false
    }
  }

  const handleImageError = (id, imgElement) => {
    setLoadingImages((prev) => ({
      ...prev,
      [id]: false
    }))
    imgElement.style.display = 'none'
    if (imgElement.nextElementSibling) {
      imgElement.nextElementSibling.style.display = 'flex'
    }
  }

  const renderSkeletonLoading = () => (
    <div className="homepage-container">
      <div className="main-content">
        <div className="book-details">
          <Skeleton type="title" />
          <Skeleton type="text" />
          <Skeleton type="text" />
          <Skeleton type="text" />
          <div className="button-container">
            <div className="skeleton button"></div>
          </div>
        </div>
        <div className="book-cover">
          <Skeleton type="cover" />
        </div>
      </div>

      <div className="popular-books">
        <h2>Popular Books</h2>
        <div className="books-grid">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="book-card">
              <Skeleton type="card" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) return renderSkeletonLoading()

  return (
    <div className="homepage-container">
      {featuredBook && (
        <div className="main-content">
          <div className="book-details">
            <h1>{featuredBook.title}</h1>
            <div className="author-info">By {featuredBook.author}</div>
            <div className="rating">
              {renderStars(featuredBook.rating)}
              <span>{featuredBook.rating}/5</span>
            </div>

            <div className="book-description">{generateDescription(featuredBook)}</div>

            <div className="button-container">
              <button className="borrow-button" onClick={handleBorrowRequest}>
                See More
              </button>
            </div>
          </div>

          <div
            className={`book-cover ${loadingImages[featuredBook?.id] !== false ? 'loading' : ''}`}
          >
            <img
              src={featuredBook.coverImage}
              alt={featuredBook.title}
              loading="lazy"
              crossOrigin="anonymous"
              onLoad={(e) => handleImageLoad(featuredBook.id, e.target)}
              onError={(e) => handleImageError(featuredBook.id, e.target)}
            />
            <div className="no-cover" style={{ display: 'none' }}>
              <FaBook />
              <p>No Cover Available</p>
            </div>
          </div>
        </div>
      )}

      <div className="popular-books">
        <h2>Popular Books</h2>
        <div className="books-grid">
          {popularBooks.map((book) => (
            <div
              key={book.id}
              className={`book-card ${loadingImages[book.id] !== false ? 'loading' : ''}`}
              onClick={() => handleBookClick(book.id)}
            >
              <img
                src={book.cover}
                alt={book.title}
                loading="lazy"
                crossOrigin="anonymous"
                onLoad={(e) => handleImageLoad(book.id, e.target)}
                onError={(e) => handleImageError(book.id, e.target)}
              />
              <div className="no-cover" style={{ display: 'none' }}>
                <FaBook />
                <p>No Cover Available</p>
              </div>
              <div className="book-info">
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
                <div className={`book-status ${book.status?.toLowerCase() || 'unknown'}`}>
                  {book.status || 'Unknown'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Homepage
