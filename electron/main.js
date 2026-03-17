// PATH: electron/main.js

const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron')
const path = require('path')
const fs = require('fs-extra')

// Load IPC handlers
require('./ipc/ffmpeg')
require('./ipc/project')
require('./ipc/templates')
require('./ipc/bundle')

// Register file protocol before app is ready
app.on('ready', () => {
  protocol.registerFileProtocol('file', (request, callback) => {
    let filePath = decodeURIComponent(request.url.replace('file:///', ''))
    if (process.platform === 'win32' && !filePath.startsWith('\\\\')) {
      filePath = filePath.replace(/^([a-zA-Z])\//, '$1:/')
    }
    const ext = path.extname(filePath).toLowerCase()
    if (ext === '.jsx' || ext === '.js' || ext === '.mjs') {
      callback({ path: filePath, mimeType: 'text/javascript' })
    } else {
      callback({ path: filePath })
    }
  })
})

const { getBuiltInPreviewPaths } = require('./ipc/previewGenerator')

let mainWindow

function createWindow() {
  const isDev = !app.isPackaged

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0F0F0F',
    frame: false,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  })

  if (isDev) {
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173')
    }, 3000)
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('dialog:openFile', async (_, filters) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters || [{ name: 'All Files', extensions: ['*'] }],
  })
  return result.filePaths
})

ipcMain.handle('dialog:openFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })
  return result.filePaths[0] || null
})

ipcMain.handle('dialog:saveFile', async (_, filters) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: filters || [{ name: 'MP4', extensions: ['mp4'] }],
  })
  return result.filePath
})

ipcMain.handle('app:minimize', () => mainWindow.minimize())
ipcMain.handle('app:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})
ipcMain.handle('app:close', () => mainWindow.close())

// Preview IPC handler
ipcMain.handle('preview:getBuiltInPaths', async () => {
  return await getBuiltInPreviewPaths()
})

// Read template Composition.jsx file content
// Used by Canvas.jsx in production to load custom templates via blob URL
ipcMain.handle('template:readFile', async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return { success: true, content }
  } catch (err) {
    return { success: false, error: err.message }
  }
})