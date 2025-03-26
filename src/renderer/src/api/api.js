// Base URLs
export const API_BASE_URL = 'http://192.168.0.145:8000'
export const OPEN_LIBRARY_BASE_URL = 'https://covers.openlibrary.org'

// API Endpoints
export const API_ENDPOINTS = {
  SEARCH: `${API_BASE_URL}/api/v1/marc/search/`,
  BOOK_DETAILS: (id) => `${API_BASE_URL}/api/v1/marc/record/${id}/`,
  ALL_BOOKS: `${API_BASE_URL}/api/v1/marc/record/`,
  BOOK_COVER: (isbn) => `${OPEN_LIBRARY_BASE_URL}/b/isbn/${isbn}-L.jpg`
}

// Add token if required (currently not used but prepared for future)
export const API_TOKEN = ''
