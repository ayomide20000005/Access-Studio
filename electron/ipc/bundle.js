// PATH: electron/ipc/bundle.js

const { ipcMain, app } = require('electron')
const path = require('path')
const { fork } = require('child_process')

// Cache serveUrls so we don't re-start server for same template twice
const bundleCache = {}

// Track child processes so we can kill them when app closes
const activeChildren = {}

ipcMain.handle('template:bundle', async (event, { folderPath }) => {
  // Return cached result immediately if server already running for this template
  if (bundleCache[folderPath]) {
    return { success: true, serveUrl: bundleCache[folderPath] }
  }

  return new Promise((resolve) => {
    const child = fork(
      path.join(__dirname, '../bundleWorker.js'),
      [JSON.stringify({ folderPath })],
      {
        detached: false,
        silent: true,
      }
    )

    // Track this child process
    activeChildren[folderPath] = child

    child.on('message', (msg) => {
      if (msg.type === 'complete') {
        // serveUrl is http://localhost:PORT — use directly, no conversion needed
        bundleCache[folderPath] = msg.serveUrl
        resolve({ success: true, serveUrl: msg.serveUrl })
      } else if (msg.type === 'error') {
        delete activeChildren[folderPath]
        resolve({ success: false, error: msg.error })
      }
    })

    child.on('error', (err) => {
      delete activeChildren[folderPath]
      resolve({ success: false, error: err.message })
    })

    child.on('exit', (code) => {
      delete activeChildren[folderPath]
      if (code !== 0 && !bundleCache[folderPath]) {
        resolve({ success: false, error: `Preview server exited with code ${code}` })
      }
    })

    // Pipe child stderr to main process stderr for debugging
    child.stderr.pipe(process.stderr)
  })
})

// Kill all preview server child processes when app closes
app.on('before-quit', () => {
  Object.values(activeChildren).forEach(child => {
    try { child.kill() } catch {}
  })
})