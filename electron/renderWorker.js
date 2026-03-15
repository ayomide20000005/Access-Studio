// PATH: electron/renderWorker.js

const { workerData, parentPort } = require('worker_threads')
const path = require('path')
const { execFile } = require('child_process')
const fs = require('fs-extra')
const ffmpegPath = require('ffmpeg-static')

function send(type, payload) {
  parentPort.postMessage({ type, ...payload })
}

function runFFmpeg(args, duration) {
  return new Promise((resolve, reject) => {
    const proc = execFile(ffmpegPath, args)

    proc.stderr.on('data', (data) => {
      const str = data.toString()
      const timeMatch = str.match(/time=(\d+):(\d+):(\d+\.\d+)/)
      if (timeMatch) {
        const hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        const seconds = parseFloat(timeMatch[3])
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        const pct = 60 + Math.round((totalSeconds / (duration || 10)) * 35)
        send('progress', { progress: Math.min(pct, 95), stage: 'Encoding...' })
      }
    })

    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`FFmpeg exited with code ${code}`))
    })

    proc.on('error', reject)
  })
}

async function run() {
  const {
    templateId,
    isCustom,
    folderPath,
    compositionId,
    inputs,
    selectedStyles,
    format,
    resolution,
    fps,
    outputPath,
    duration,
    projectRoot,
    tempVideoPath,
  } = workerData

  const resolutionMap = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '4k': { width: 3840, height: 2160 },
  }

  const { width, height } = resolutionMap[resolution] || resolutionMap['1080p']
  const durationInFrames = (duration || 10) * (parseInt(fps) || 30)
  const cpuCount = require('os').cpus().length

  try {
    const { bundle } = require('@remotion/bundler')
    const { renderMedia, selectComposition } = require('@remotion/renderer')

    // Stage 1 — bundle
    send('progress', { progress: 5, stage: 'Bundling project...' })

    // For custom templates — use the template's own index.js as entry point
    // For built-in templates — use the project's remotion/index.js
    const entryPoint = isCustom && folderPath
      ? path.join(folderPath, 'index.js')
      : path.join(projectRoot, 'remotion', 'index.js')

    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => {
        config.cache = false
        return config
      },
    })

    send('progress', { progress: 20, stage: 'Selecting composition...' })

    // For custom templates — pass inputs directly as props
    // For built-in templates — wrap in templateId/inputs/selectedStyles
    const props = isCustom
      ? {
          ...(inputs || {}),
          ...(selectedStyles || {}),
        }
      : {
          templateId,
          inputs: { ...inputs, fontFamily: 'Inter' },
          selectedStyles: selectedStyles || {},
        }

    // For custom templates — use their compositionId
    // For built-in templates — always use MainComposition
    const targetCompositionId = isCustom && compositionId
      ? compositionId
      : 'MainComposition'

    // Stage 2 — select composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: targetCompositionId,
      inputProps: props,
    })

    send('progress', { progress: 25, stage: 'Rendering frames...' })

    // Stage 3 — render with multi-core
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps: parseInt(fps) || 30,
        width,
        height,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: tempVideoPath,
      inputProps: props,
      concurrency: Math.max(1, cpuCount - 1),
      onProgress: ({ progress }) => {
        const pct = 25 + Math.round(progress * 35)
        send('progress', { progress: pct, stage: `Rendering frames... ${Math.round(progress * 100)}%` })
      },
    })

    send('progress', { progress: 60, stage: 'Encoding video...' })

    // Stage 4 — FFmpeg encode
    let args = ['-y', '-i', tempVideoPath]

    if (format === 'gif') {
      args.push(
        '-vf', `scale=${width}:${height},fps=15,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        '-loop', '0',
        outputPath
      )
    } else {
      args.push(
        '-vf', `scale=${width}:${height}`,
        '-c:v', 'libx264',
        '-crf', '18',
        '-preset', 'fast',
        '-c:a', 'aac',
        '-b:a', '192k',
        outputPath
      )
    }

    await runFFmpeg(args, duration)

    // Stage 5 — cleanup
    await fs.remove(tempVideoPath)

    send('progress', { progress: 100, stage: 'Done' })
    send('complete', { outputPath })

  } catch (err) {
    send('error', { error: err.message })
  }
}

run()