// PATH: electron/bundleWorker.js
// This runs as a child process via child_process.fork()
// It starts a Remotion preview server for the custom template folder

const path = require('path')

async function run() {
  const { folderPath } = JSON.parse(process.argv[2])

  try {
    const { bundle } = require('@remotion/bundler')
    const { getCompositions, RenderInternals } = require('@remotion/renderer')

    const entryPoint = path.join(folderPath, 'index.js')

    process.send({ type: 'progress', stage: 'Starting preview server...' })

    // Bundle the template — returns a local server URL like http://localhost:XXXX
    const serveUrl = await bundle({
      entryPoint,
      webpackOverride: (config) => {
        config.cache = false
        return config
      },
      onProgress: () => {},
    })

    // serveUrl is an http://localhost:PORT URL — send it directly
    process.send({ type: 'complete', serveUrl })

    // Keep process alive to keep the server running
    // It will be killed when the user switches templates or closes the app
    process.on('SIGTERM', () => process.exit(0))
    process.on('SIGINT', () => process.exit(0))

  } catch (err) {
    process.send({ type: 'error', error: err.message })
    process.exit(1)
  }
}

run()