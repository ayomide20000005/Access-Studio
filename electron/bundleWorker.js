// PATH: electron/bundleWorker.js
// This runs as a child process via child_process.fork()
// It bundles the template then starts a local HTTP server to serve it

const path = require('path')
const http = require('http')
const fs = require('fs')

async function run() {
  const { folderPath } = JSON.parse(process.argv[2])

  try {
    const { bundle } = require('@remotion/bundler')

    const entryPoint = path.join(folderPath, 'index.js')

    process.send({ type: 'progress', stage: 'Bundling template...' })

    const bundleDir = await bundle({
      entryPoint,
      webpackOverride: (config) => {
        config.cache = false
        return config
      },
    })

    process.send({ type: 'progress', stage: 'Starting preview server...' })

    // Start a simple HTTP server to serve the bundle folder
    const server = http.createServer((req, res) => {
      // Strip query string and hash from URL
      let urlPath = req.url.split('?')[0].split('#')[0]
      if (urlPath === '/' || urlPath === '') urlPath = '/index.html'

      const filePath = path.join(bundleDir, urlPath)

      fs.readFile(filePath, (err, data) => {
        if (err) {
          // Try serving index.html for any unmatched route (SPA fallback)
          fs.readFile(path.join(bundleDir, 'index.html'), (err2, data2) => {
            if (err2) {
              res.writeHead(404)
              res.end('Not found')
              return
            }
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(data2)
          })
          return
        }

        // Set correct content type
        const ext = path.extname(filePath)
        const contentTypes = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.wasm': 'application/wasm',
          '.mp4': 'video/mp4',
          '.mp3': 'audio/mpeg',
          '.wav': 'audio/wav',
          '.webm': 'video/webm',
        }
        const contentType = contentTypes[ext] || 'application/octet-stream'

        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
      })
    })

    // Listen on a random available port
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      const serveUrl = `http://127.0.0.1:${port}`

      process.send({ type: 'complete', serveUrl })
    })

    // Keep process alive to keep server running
    process.on('SIGTERM', () => {
      server.close()
      process.exit(0)
    })

    process.on('SIGINT', () => {
      server.close()
      process.exit(0)
    })

  } catch (err) {
    process.send({ type: 'error', error: err.message })
    process.exit(1)
  }
}

run()