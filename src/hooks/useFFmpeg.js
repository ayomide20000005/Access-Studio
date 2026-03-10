import { useState, useCallback } from 'react'

export const useFFmpeg = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const setupProgressListener = useCallback(() => {
    window.electron.on('export:progress', (data) => {
      setProgress(data.progress || 0)
    })
    window.electron.on('export:complete', () => {
      setIsProcessing(false)
      setProgress(100)
    })
    window.electron.on('export:error', (data) => {
      setError(data.error)
      setIsProcessing(false)
    })
  }, [])

  const renderVideo = useCallback(async (options) => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setupProgressListener()

    try {
      const result = await window.electron.renderVideo(options)
      if (!result.success) {
        setError(result.error)
        setIsProcessing(false)
        return null
      }
      return result.outputPath
    } catch (err) {
      setError(err.message)
      setIsProcessing(false)
      return null
    }
  }, [setupProgressListener])

  const exportVideo = useCallback(async (options) => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setupProgressListener()

    try {
      const result = await window.electron.exportVideo(options)
      if (!result.success) {
        setError(result.error)
        setIsProcessing(false)
        return null
      }
      return result.outputPath
    } catch (err) {
      setError(err.message)
      setIsProcessing(false)
      return null
    }
  }, [setupProgressListener])

  const reset = useCallback(() => {
    setIsProcessing(false)
    setProgress(0)
    setError(null)
    window.electron.off('export:progress')
    window.electron.off('export:complete')
    window.electron.off('export:error')
  }, [])

  return {
    isProcessing,
    progress,
    error,
    renderVideo,
    exportVideo,
    reset,
  }
}

export default useFFmpeg