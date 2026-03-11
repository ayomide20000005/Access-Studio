import { useState, useEffect, useCallback } from 'react'

export const useTemplates = () => {
  const [userTemplates, setUserTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const result = await window.electron.listTemplates()
      if (result.success) {
        setUserTemplates(result.templates)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTemplates()
  }, [])

  const importTemplate = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const folderPath = await window.electron.openFolder()
      if (!folderPath) {
        setLoading(false)
        return null
      }
      const result = await window.electron.importTemplate(folderPath)
      if (result.success) {
        await loadTemplates()
        return result.template
      } else {
        setError(result.error)
        return null
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [loadTemplates])

  const deleteTemplate = useCallback(async (templateId) => {
    try {
      const result = await window.electron.deleteTemplate(templateId)
      if (result.success) {
        await loadTemplates()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    }
  }, [loadTemplates])

  const updateTemplate = useCallback(async (templateId, updates) => {
    try {
      const result = await window.electron.updateTemplate(templateId, updates)
      if (result.success) {
        await loadTemplates()
        return result.template
      } else {
        setError(result.error)
        return null
      }
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [loadTemplates])

  return {
    userTemplates,
    loading,
    error,
    loadTemplates,
    importTemplate,
    deleteTemplate,
    updateTemplate,
  }
}

export default useTemplates