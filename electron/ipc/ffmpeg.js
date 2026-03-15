// PATH: electron/ipc/ffmpeg.js

const { ipcMain, app } = require('electron')
const path = require('path')
const { execFile } = require('child_process')
const { Worker } = require('worker_threads')
const fs = require('fs-extra')
const ffmpegPath = require('ffmpeg-static')

// Legacy FFmpeg helper — kept for ffmpeg:export handler
function runFFmpeg(args, onProgress) {
  return new Promise((resolve, reject) => {
    const proc = execFile(ffmpegPath, args)

    proc.stderr.on('data', (data) => {
      const str = data.toString()
      const timeMatch = str.match(/time=(\d+):(\d+):(\d+\.\d+)/)
      if (timeMatch && onProgress) {
        const hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        const seconds = parseFloat(timeMatch[3])
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        onProgress(totalSeconds)
      }
    })

    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`FFmpeg exited with code ${code}`))
    })

    proc.on('error', reject)
  })
}

const resolutionMap = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
}

// Main render handler — runs in worker thread so UI never freezes
ipcMain.handle('ffmpeg:render', async (event, options) => {
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
  } = options

  const projectRoot = path.join(__dirname, '../../')
  const tempDir = path.join(app.getPath('temp'), 'acces_studio_render')
  const tempVideoPath = path.join(tempDir, `render_${Date.now()}.mp4`)

  await fs.ensureDir(tempDir)

  return new Promise((resolve) => {
    const worker = new Worker(path.join(__dirname, '../renderWorker.js'), {
      workerData: {
        templateId,
        isCustom: isCustom || false,
        folderPath: folderPath || null,
        compositionId: compositionId || 'MainComposition',
        inputs,
        selectedStyles,
        format,
        resolution,
        fps,
        outputPath,
        duration,
        projectRoot,
        tempVideoPath,
      },
    })

    worker.on('message', (msg) => {
      if (msg.type === 'progress') {
        event.sender.send('export:progress', {
          progress: msg.progress,
          stage: msg.stage,
        })
      } else if (msg.type === 'complete') {
        event.sender.send('export:complete', { outputPath: msg.outputPath })
        resolve({ success: true, outputPath: msg.outputPath })
      } else if (msg.type === 'error') {
        event.sender.send('export:error', { error: msg.error })
        resolve({ success: false, error: msg.error })
      }
    })

    worker.on('error', (err) => {
      event.sender.send('export:error', { error: err.message })
      resolve({ success: false, error: err.message })
    })

    worker.on('exit', (code) => {
      if (code !== 0) {
        const msg = `Worker stopped with exit code ${code}`
        event.sender.send('export:error', { error: msg })
        resolve({ success: false, error: msg })
      }
    })
  })
})

// Legacy export handler — kept for compatibility
ipcMain.handle('ffmpeg:export', async (event, options) => {
  const { inputPath, outputPath, format, resolution } = options
  const { width, height } = resolutionMap[resolution] || resolutionMap['1080p']

  try {
    let args = ['-y', '-i', inputPath]

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

    await runFFmpeg(args, (progress) => {
      event.sender.send('export:progress', { progress })
    })

    event.sender.send('export:complete', { outputPath })
    return { success: true, outputPath }
  } catch (error) {
    event.sender.send('export:error', { error: error.message })
    return { success: false, error: error.message }
  }
})