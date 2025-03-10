const { app, BrowserWindow } = require('electron')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    maximizable: true,
    fullscreenable: false,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", 'http://countmein.pythonanywhere.com', 'https://openlibrary.org'],
          imgSrc: ["'self'", 'https://covers.openlibrary.org', 'data:', 'blob:', 'https:']
        }
      }
    }
  })

  // Prevent window from being maximized
  win.setMaximizable(false)

  win.loadFile('index.html')
}

app.on('ready', createWindow)
