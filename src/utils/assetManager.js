// This replaces fluent-ffmpeg entirely with direct ffmpeg-static calls
// This is the proper fix for the fluent-ffmpeg deprecation warning

const { execFile } = require('child_process')
const ffmpegPath = require('ffmpeg-static')
const path = require('path')
const fs = require('fs-extra')

// Core runner — all ffmpeg calls go through here
const runFFmpeg = (args) => {
  return new Promise((resolve, reject) => {
    const process = execFile(ffmpegPath, args, { maxBuffer: 1024 * 1024 * 100 })

    let stderr = ''

    process.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true })
      } else {
        reject(new Error(`FFmpeg failed with code ${code}\n${stderr}`))
      }
    })

    process.on('error', (err) => {
      reject(new Error(`FFmpeg process error: ${err.message}`))
    })
  })
}

// Merge video and audio into one file
const mergeVideoAudio = async (videoPath, audioPath, outputPath) => {
  const args = [
    '-y',
    '-i', videoPath,
    '-i', audioPath,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-shortest',
    outputPath,
  ]
  return runFFmpeg(args)
}

// Export to MP4 with resolution
const exportToMP4 = async (inputPath, outputPath, width, height, fps = 30) => {
  const args = [
    '-y',
    '-i', inputPath,
    '-vf', `scale=${width}:${height}`,
    '-c:v', 'libx264',
    '-crf', '18',
    '-preset', 'fast',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-r', String(fps),
    outputPath,
  ]
  return runFFmpeg(args)
}

// Export to GIF
const exportToGIF = async (inputPath, outputPath, width, height) => {
  const args = [
    '-y',
    '-i', inputPath,
    '-vf', `scale=${width}:${height}:flags=lanczos,fps=15,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    '-loop', '0',
    outputPath,
  ]
  return runFFmpeg(args)
}

// Extract audio from video
const extractAudio = async (inputPath, outputPath) => {
  const args = [
    '-y',
    '-i', inputPath,
    '-vn',
    '-c:a', 'aac',
    '-b:a', '192k',
    outputPath,
  ]
  return runFFmpeg(args)
}

// Audio ducking — lower background music when voiceover plays
const duckAudio = async (backgroundPath, voiceoverPath, outputPath) => {
  const args = [
    '-y',
    '-i', backgroundPath,
    '-i', voiceoverPath,
    '-filter_complex',
    '[0:a]volume=0.3[bg];[bg][1:a]amix=inputs=2:duration=longest[out]',
    '-map', '[out]',
    '-c:a', 'aac',
    '-b:a', '192k',
    outputPath,
  ]
  return runFFmpeg(args)
}

// Trim a video clip
const trimVideo = async (inputPath, outputPath, startSeconds, durationSeconds) => {
  const args = [
    '-y',
    '-i', inputPath,
    '-ss', String(startSeconds),
    '-t', String(durationSeconds),
    '-c:v', 'copy',
    '-c:a', 'copy',
    outputPath,
  ]
  return runFFmpeg(args)
}

// Concatenate multiple video clips
const concatenateVideos = async (inputPaths, outputPath) => {
  const listFile = path.join(path.dirname(outputPath), 'concat_list.txt')
  const listContent = inputPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n')
  await fs.writeFile(listFile, listContent)

  const args = [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', listFile,
    '-c:v', 'libx264',
    '-c:a', 'aac',
    outputPath,
  ]

  try {
    const result = await runFFmpeg(args)
    await fs.remove(listFile)
    return result
  } catch (err) {
    await fs.remove(listFile)
    throw err
  }
}

// Get video metadata
const getVideoInfo = (inputPath) => {
  return new Promise((resolve, reject) => {
    const ffprobePath = ffmpegPath.replace('ffmpeg', 'ffprobe')
    const args = [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_streams',
      '-show_format',
      inputPath,
    ]

    execFile(ffprobePath, args, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
      if (err) {
        // fallback if ffprobe not available
        resolve({ duration: 0, width: 1920, height: 1080, fps: 30 })
        return
      }
      try {
        const info = JSON.parse(stdout)
        const videoStream = info.streams?.find(s => s.codec_type === 'video')
        resolve({
          duration: parseFloat(info.format?.duration || 0),
          width: videoStream?.width || 1920,
          height: videoStream?.height || 1080,
          fps: eval(videoStream?.r_frame_rate || '30/1'),
        })
      } catch {
        resolve({ duration: 0, width: 1920, height: 1080, fps: 30 })
      }
    })
  })
}

module.exports = {
  runFFmpeg,
  mergeVideoAudio,
  exportToMP4,
  exportToGIF,
  extractAudio,
  duckAudio,
  trimVideo,
  concatenateVideos,
  getVideoInfo,
}