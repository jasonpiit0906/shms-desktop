const CSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'http://countmein.pythonanywhere.com', 'data:', 'blob:'],
  'connect-src': ["'self'", 'http://countmein.pythonanywhere.com'],
  'font-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"]
}

module.exports = CSP
