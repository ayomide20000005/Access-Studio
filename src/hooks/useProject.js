import { useState, useCallback } from 'react'

export const useProject = () => {
  const [project, setProject] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)

  const createProject = useCallback((template) => {
    const newProject = {
      id: Date.now(),
      name: `${template.name} — ${new Date().toLocaleDateString()}`,
      template: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: [
        {
          id: 1,
          name: 'Scene 1',
          duration: 150,
          layers: [],
        },
      ],
      settings: {
        fps: 30,
        width: 1920,
        height: 1080,
        duration: 300,
      },
      brand: {
        primaryColor: '#7C3AED',
        secondaryColor: '#4F46E5',
        fontFamily: 'Inter',
        logoPath: null,
      },
      inputs: {},
    }
    setProject(newProject)
    return newProject
  }, [])

  const updateProject = useCallback((updates) => {
    setProject(prev => {
      if (!prev) return null
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const updateScene = useCallback((sceneId, updates) => {
    setProject(prev => {
      if (!prev) return null
      return {
        ...prev,
        scenes: prev.scenes.map(scene =>
          scene.id === sceneId ? { ...scene, ...updates } : scene
        ),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const addScene = useCallback(() => {
    setProject(prev => {
      if (!prev) return null
      const newScene = {
        id: Date.now(),
        name: `Scene ${prev.scenes.length + 1}`,
        duration: 150,
        layers: [],
      }
      return {
        ...prev,
        scenes: [...prev.scenes, newScene],
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const deleteScene = useCallback((sceneId) => {
    setProject(prev => {
      if (!prev || prev.scenes.length <= 1) return prev
      return {
        ...prev,
        scenes: prev.scenes.filter(s => s.id !== sceneId),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const addLayer = useCallback((sceneId, layer) => {
    setProject(prev => {
      if (!prev) return null
      return {
        ...prev,
        scenes: prev.scenes.map(scene =>
          scene.id === sceneId
            ? { ...scene, layers: [...scene.layers, { ...layer, id: Date.now() }] }
            : scene
        ),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const updateLayer = useCallback((sceneId, layerId, updates) => {
    setProject(prev => {
      if (!prev) return null
      return {
        ...prev,
        scenes: prev.scenes.map(scene =>
          scene.id === sceneId
            ? {
                ...scene,
                layers: scene.layers.map(layer =>
                  layer.id === layerId ? { ...layer, ...updates } : layer
                ),
              }
            : scene
        ),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const deleteLayer = useCallback((sceneId, layerId) => {
    setProject(prev => {
      if (!prev) return null
      return {
        ...prev,
        scenes: prev.scenes.map(scene =>
          scene.id === sceneId
            ? { ...scene, layers: scene.layers.filter(l => l.id !== layerId) }
            : scene
        ),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const saveProject = useCallback(async () => {
    if (!project) return false
    setIsSaving(true)
    setError(null)
    try {
      await window.electron.saveProject(project)
      setLastSaved(new Date())
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [project])

  const loadProject = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const files = await window.electron.openFile([
        { name: 'Acces Studio Project', extensions: ['acces'] },
      ])
      if (!files || !files[0]) return null
      const loaded = await window.electron.loadProject(files[0])
      setProject(loaded)
      return loaded
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const closeProject = useCallback(() => {
    setProject(null)
    setLastSaved(null)
    setError(null)
  }, [])

  return {
    project,
    isSaving,
    isLoading,
    error,
    lastSaved,
    createProject,
    updateProject,
    updateScene,
    addScene,
    deleteScene,
    addLayer,
    updateLayer,
    deleteLayer,
    saveProject,
    loadProject,
    closeProject,
  }
}

export default useProject