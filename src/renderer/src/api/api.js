import axios from 'axios'

const API_URL = 'http://192.168.0.145:8000/api/v1'

const headers = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

// User APIs
export const fetchUsers = async (token) => {
  const response = await axios.get(`${API_URL}/accounts/auth/users/`, getAuthHeaders(token))
  return response.data
}

// Auth APIs
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/auth/users/`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'An error occurred during registration. Please try again later.'
    )
  }
}

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/auth/jwt/create/`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed.')
  }
}

export const activateUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/auth/users/activation/`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Activation failed.')
  }
}

export const resetPassword = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/auth/users/reset_password/`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Reset password failed.')
  }
}

export const resetPasswordConfirm = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/accounts/auth/users/reset_password_confirm/`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Reset password confirmation failed.')
  }
}

export const fetchUserDetails = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/auth/users/me/`, getAuthHeaders(token))
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Fetch user details failed.')
  }
}

// POST: Create a new user
export const createUser = async (token, payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/accounts/auth/users/`,
      payload,
      getAuthHeaders(token) // Use default JSON content type
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create user')
  }
}

export const fetchRecords = async (page = 1, search = '') => {
  try {
    const response = await axios.get(
      `${API_URL}/marc/search/?page=${page}&page_size=10&search=${encodeURIComponent(search)}`
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Books')
  }
}

export const fetchBookDetails = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/marc/record/${bookId}/`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch Book Details')
  }
}
