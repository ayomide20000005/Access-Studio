const path = require('path')
const fs = require('fs-extra')
const { exportToMP4, exportToGIF, mergeVideoAudio, duckAudio } = require('./ffmpeg')

const resolutionPresets = {
  youtube: { width: 1920, height: 1080, fps: 30, label: 'YouTube (1080p)' },
  instagram: { width: 1080, height: 1080, fps: 30, label: 'Instagram (Square)' },
  instagramStory: { width: 1080, height: 1920, fps: 30, label: 'Instagram Story' },
  tiktok: { width: 1080, height: 1920, fps: 30, label: 'TikTok' },
  twitter: { width: 1280, height: 720, fps: 30, label: 'Twitter (720p)' },
  linkedin: { width: 1920, height: 1080, fps: 30, label: 'LinkedIn (1080p)' },
  custom: { width: 1920, height: 1080, fps: 30, label: 'Custom' },
}

// Main export function
const exportVideo = async ({
  renderedVideoPath,
  voiceoverPath,
  backgroundAudioPath,
  outputPath,
  format,
  resolution,
  onProgress,
}) => {
  try {
    const preset = resolutionPresets[resolution] || resolutionPresets.youtube
    const tempDir = path.join(path.dirname(outputPath), 'acces_temp')
    await fs.ensureDir(tempDir)

    let currentPath = renderedVideoPath

    // Step 1 — merge audio if needed
    if (voiceoverPath && backgroundAudioPath) {
      onProgress && onProgress(10, 'Mixing audio...')
      const mixedAudioPath = path.join(tempDir, 'mixed_audio.aac')
      await duckAudio(backgroundAudioPath, voiceoverPath, mixedAudioPath)
      const mergedPath = path.join(tempDir, 'merged.mp4')
      await mergeVideoAudio(currentPath, mixedAudioPath, mergedPath)
      currentPath = mergedPath
    } else if (voiceoverPath) {
      onProgress && onProgress(10, 'Adding voiceover...')
      const mergedPath = path.join(tempDir, 'merged_voice.mp4')
      await mergeVideoAudio(currentPath, voiceoverPath, mergedPath)
      currentPath = mergedPath
    } else if (backgroundAudioPath) {
      onProgress && onProgress(10, 'Adding background audio...')
      const mergedPath = path.join(tempDir, 'merged_bg.mp4')
      await mergeVideoAudio(currentPath, backgroundAudioPath, mergedPath)
      currentPath = mergedPath
    }

    // Step 2 — export to final format
    onProgress && onProgress(50, `Exporting as ${format.toUpperCase()}...`)

    if (format === 'gif') {
      await exportToGIF(currentPath, outputPath, preset.width, preset.height)
    } else {
      await exportToMP4(currentPath, outputPath, preset.width, preset.height, preset.fps)
    }

    // Step 3 — cleanup temp files
    onProgress && onProgress(90, 'Cleaning up...')
    await fs.remove(tempDir)

    onProgress && onProgress(100, 'Done')
    return { success: true, outputPath }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

const getResolutionPresets = () => resolutionPresets

const getPreset = (resolution) => resolutionPresets[resolution] || resolutionPresets.youtube

module.exports = {
  exportVideo,
  getResolutionPresets,
  getPreset,
  resolutionPresets,
}