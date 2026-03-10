import { useState, useCallback } from 'react'

export const useAssets = () => {
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAssetType = (ext) => {
    const imageExts = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']
    const videoExts = ['mp4', 'mov', 'webm', 'avi']
    const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a']
    if (imageExts.includes(ext)) return 'image'
    if (videoExts.includes(ext)) return 'video'
    if (audioExts.includes(ext)) return 'audio'
    return 'other'
  }

  const importAsset = useCallback(async (acceptedTypes = 'all') => {
    setError(null)
    try {
      let filters = [{ name: 'All Media', extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'mp4', 'mov', 'webm', 'mp3', 'wav', 'ogg'] }]

      if (acceptedTypes === 'image') {
        filters = [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg'] }]
      } else if (acceptedTypes === 'video') {
        filters = [{ name: 'Videos', extensions: ['mp4', 'mov', 'webm'] }]
      } else if (acceptedTypes === 'audio') {
        filters = [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }]
      }

      const files = await window.electron.openFile(filters)
      if (!files || !files[0]) return null

      const filePath = files[0]
      const fileName = filePath.split('\\').pop().split('/').pop()
      const ext = fileName.split('.').pop().toLowerCase()
      const type = getAssetType(ext)

      const asset = {
        id: Date.now(),
        name: fileName,
        path: filePath,
        type,
        ext,
        importedAt: new Date().toISOString(),
      }

      setAssets(prev => {
        const exists = prev.find(a => a.path === filePath)
        if (exists) return prev
        return [...prev, asset]
      })

      return asset
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])

  const removeAsset = useCallback((id) => {
    setAssets(prev => prev.filter(a => a.id !== id))
  }, [])

  const clearAssets = useCallback(() => {
    setAssets([])
  }, [])

  const getAssetsByType = useCallback((type) => {
    if (type === 'all') return assets
    return assets.filter(a => a.type === type)
  }, [assets])

  const getAssetById = useCallback((id) => {
    return assets.find(a => a.id === id) || null
  }, [assets])

  return {
    assets,
    isLoading,
    error,
    importAsset,
    removeAsset,
    clearAssets,
    getAssetsByType,
    getAssetById,
  }
}

export default useAssets