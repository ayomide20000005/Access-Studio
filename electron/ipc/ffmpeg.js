const { ipcMain, app } = require('electron')
const path = require('path')
const { execFile, spawn } = require('child_process')
const fs = require('fs-extra')
const ffmpegPath = require('ffmpeg-static')

// Helper to run ffmpeg commands
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
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`))
      }
    })

    proc.on('error', reject)
  })
}

// Helper to run Remotion renderer — Windows path safe
function runRemotionRender(options) {
  return new Promise((resolve, reject) => {
    const {
      compositionId,
      outputPath,
      props,
      durationInFrames,
      fps,
      width,
      height,
    } = options

    const projectRoot = path.join(__dirname, '../../')

    // Use npx to call remotion — avoids Windows bin path spacing issues
    const args = [
      'remotion',
      'render',
      'remotion/index.js',
      compositionId,
      outputPath,
      '--props', JSON.stringify(props),
      '--duration-in-frames', String(durationInFrames),
      '--fps', String(fps),
      '--width', String(width),
      '--height', String(height),
      '--codec', 'h264',
    ]

    const proc = spawn('npx', args, {
      cwd: projectRoot,
      shell: true,
      windowsHide: true,
      env: {
        ...process.env,
        // Force npm/npx to use short paths on Windows to avoid spacing issues
        NODE_PATH: path.join(projectRoot, 'node_modules'),
      },
    })

    proc.stdout.on('data', (data) => {
      console.log('[Remotion]', data.toString())
    })

    proc.stderr.on('data', (data) => {
      console.error('[Remotion Error]', data.toString())
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath)
      } else {
        reject(new Error(`Remotion renderer exited with code ${code}`))
      }
    })

    proc.on('error', reject)
  })
}

// Updated resolution map to match new export options
const resolutionMap = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
}

// Render composition with Remotion then encode with FFmpeg
ipcMain.handle('ffmpeg:render', async (event, options) => {
  const {
    templateId,
    inputs,
    selectedStyles,
    format,
    resolution,
    fps,
    outputPath,
    duration,
  } = options

  const { width, height } = resolutionMap[resolution] || resolutionMap['1080p']
  const durationInFrames = (duration || 10) * (parseInt(fps) || 30)

  // Use app userData for temp files — guaranteed no spaces on packaged app
  const tempDir = path.join(app.getPath('temp'), 'acces_studio_render')
  const tempVideoPath = path.join(tempDir, `render_${Date.now()}.mp4`)

  try {
    await fs.ensureDir(tempDir)

    // Stage 1 — Remotion render
    event.sender.send('export:progress', { progress: 5, stage: 'Starting Remotion render...' })

    await runRemotionRender({
      compositionId: 'MainComposition',
      outputPath: tempVideoPath,
      props: {
        templateId,
        inputs: {
          ...inputs,
          fontFamily: 'Inter',
        },
        selectedStyles: selectedStyles || {},
      },
      durationInFrames,
      fps: parseInt(fps) || 30,
      width,
      height,
    })

    event.sender.send('export:progress', { progress: 60, stage: 'Encoding video...' })

    // Stage 2 — FFmpeg encode to final format
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

    await runFFmpeg(args, (progress) => {
      const mapped = 60 + Math.round((progress / (duration || 10)) * 35)
      event.sender.send('export:progress', { progress: Math.min(mapped, 95), stage: 'Encoding...' })
    })

    // Stage 3 — cleanup
    await fs.remove(tempDir)

    event.sender.send('export:progress', { progress: 100, stage: 'Done' })
    event.sender.send('export:complete', { outputPath })
    return { success: true, outputPath }

  } catch (error) {
    await fs.remove(tempDir).catch(() => {})
    event.sender.send('export:error', { error: error.message })
    return { success: false, error: error.message }
  }
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