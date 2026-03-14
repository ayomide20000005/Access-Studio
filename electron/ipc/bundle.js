// PATH: electron/ipc/bundle.js

const { ipcMain } = require('electron')
const path = require('path')

// Cache bundled templates so we don't re-bundle every time
const bundleCache = {}

ipcMain.handle('template:bundle', async (_, { folderPath }) => {
  try {
    // Return cached bundle if already bundled this session
    if (bundleCache[folderPath]) {
      return { success: true, serveUrl: bundleCache[folderPath] }
    }

    const { bundle } = require('@remotion/bundler')

    const entryPoint = path.join(folderPath, 'index.js')

    const serveUrl = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    })

    // Cache it for this session
    bundleCache[folderPath] = serveUrl

    return { success: true, serveUrl }
  } catch (err) {
    return { success: false, error: err.message }
  }
})