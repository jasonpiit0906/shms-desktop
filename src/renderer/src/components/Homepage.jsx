import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import '../styles/Homepage.css'
import '../styles/Navbar.css'
import defaultCover from '../assets/default-book-cover.svg'
import logo from '../assets/logo.png' // Make sure to add your logo

function Homepage() {
  const [featuredBook, setFeaturedBook] = useState(null)
  const [popularBooks, setPopularBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookDescription, setBookDescription] = useState('')
  const navigate = useNavigate()

  const getCoverUrl = (isbn) =>
    isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : defaultCover

  const fetchBookDescription = async (isbn) => {
    if (!isbn) return

    try {
      const response = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      )
      const bookData = response.data[`ISBN:${isbn}`]
      if (bookData && bookData.description) {
        const description =
          typeof bookData.description === 'object'
            ? bookData.description.value
            : bookData.description
        setBookDescription(description)
      }
    } catch (error) {
      console.error('Error fetching book description:', error)
      setBookDescription('No description available.')
    }
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://countmein.pythonanywhere.com/api/v1/marc/search/')
        const { results } = response.data

        if (results.length > 0) {
          const mainBook = results[0]
          setFeaturedBook({
            ...mainBook,
            rating: 4.5,
            coverImage: getCoverUrl(mainBook.isbn)
          })

          // Fetch description for the featured book
          if (mainBook.isbn) {
            fetchBookDescription(mainBook.isbn)
          }

          // Change from 6 to 11 to get 10 books after the featured book
          const nextTenBooks = results.slice(1, 11).map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover: getCoverUrl(book.isbn),
            status: book.status
          }))
          setPopularBooks(nextTenBooks)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

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

  if (loading) return <div className="loading">Loading...</div>

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

            <p className="book-description">{bookDescription || 'Description not available.'}</p>

            <div className="button-container">
              <button
                className="borrow-button"
                onClick={handleBorrowRequest}
                disabled={featuredBook.status !== 'Available'}
              >
                {featuredBook.status === 'Available'
                  ? 'Borrow Book Request'
                  : 'Currently Unavailable'}
              </button>
            </div>
          </div>

          <div className="book-cover">
            <img
              src={featuredBook.coverImage}
              alt={featuredBook.title}
              loading="lazy"
              onError={(e) => (e.target.src = defaultCover)}
            />
          </div>
        </div>
      )}

      <div className="popular-books">
        <h2>Popular Books</h2>
        <div className="books-grid">
          {popularBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
              <img
                src={book.cover}
                alt={book.title}
                loading="lazy"
                onError={(e) => (e.target.src = defaultCover)}
              />
              <p className="book-title">{book.title}</p>
              <p className="book-author">{book.author}</p>
              <div className={`book-status ${book.status.toLowerCase()}`}>{book.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Homepage
