import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css' // Make sure this is your main app styles
import { Provider } from 'react-redux'
import { store } from './Features/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
