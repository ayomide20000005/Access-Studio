// PATH: src/hooks/useExport.js

import { useState, useCallback } from 'react'

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [error, setError] = useState(null)
  const [outputPath, setOutputPath] = useState(null)

  const startExport = useCallback(async ({ project, format, resolution, fps }) => {
    setIsExporting(true)
    setProgress(0)
    setStage('Choosing output location...')
    setError(null)
    setOutputPath(null)

    try {
      // Step 1 — ask user where to save
      const savePath = await window.electron.saveFile([
        format === 'gif'
          ? { name: 'GIF', extensions: ['gif'] }
          : { name: 'MP4 Video', extensions: ['mp4'] },
      ])

      if (!savePath) {
        setIsExporting(false)
        setStage('')
        return null
      }

      // Step 2 — listen for progress events from main process
      window.electron.on('export:progress', (data) => {
        setProgress(data.progress || 0)
        setStage(data.stage || 'Rendering...')
      })

      window.electron.on('export:complete', (data) => {
        setOutputPath(data.outputPath)
        setIsExporting(false)
        setProgress(100)
        setStage('Export complete')
        window.electron.off('export:progress')
        window.electron.off('export:complete')
        window.electron.off('export:error')
      })

      window.electron.on('export:error', (data) => {
        setError(data.error)
        setIsExporting(false)
        setStage('')
        window.electron.off('export:progress')
        window.electron.off('export:complete')
        window.electron.off('export:error')
      })

      // Step 3 — trigger render in main process
      setStage('Starting render...')
      setProgress(5)

      // Get template object from project
      const template = project?.template

      const result = await window.electron.renderVideo({
        templateId: template?.id || 'demo-video',
        // Pass folderPath and compositionId for custom templates
        isCustom: template?.isCustom || false,
        folderPath: template?.folderPath || null,
        compositionId: template?.composition || 'MainComposition',
        inputs: project?.inputs || {},
        selectedStyles: project?.selectedStyles || {},
        format,
        resolution,
        fps: parseInt(fps) || 30,
        duration: project?.inputs?.duration || 10,
        outputPath: savePath,
      })

      if (!result.success) {
        setError(result.error)
        setIsExporting(false)
        setStage('')
        window.electron.off('export:progress')
        window.electron.off('export:complete')
        window.electron.off('export:error')
        return null
      }

      return result.outputPath

    } catch (err) {
      setError(err.message)
      setIsExporting(false)
      setStage('')
      window.electron.off('export:progress')
      window.electron.off('export:complete')
      window.electron.off('export:error')
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setIsExporting(false)
    setProgress(0)
    setStage('')
    setError(null)
    setOutputPath(null)
  }, [])

  const cancelExport = useCallback(() => {
    reset()
    window.electron.off('export:progress')
    window.electron.off('export:complete')
    window.electron.off('export:error')
  }, [reset])

  return {
    isExporting,
    progress,
    stage,
    error,
    outputPath,
    startExport,
    cancelExport,
    reset,
  }
}

export default useExport