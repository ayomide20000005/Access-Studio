const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

// Load IPC handlers
require('./ipc/ffmpeg')
require('./ipc/project')

let mainWindow

function createWindow() {
  const isDev = !app.isPackaged

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0F0F0F',
    titleBarStyle: 'hiddenInset',
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    // Wait for Vite to be ready before loading
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173')
    }, 3000)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
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