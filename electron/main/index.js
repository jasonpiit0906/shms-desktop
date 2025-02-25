const { app, BrowserWindow } = require('electron')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
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

  win.loadFile('index.html')
}

app.on('ready', createWindow)
