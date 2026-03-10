import { useState, useEffect, createContext, useContext } from 'react'

const ProjectContext = createContext(null)

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  const createProject = (template) => {
    const project = {
      id: Date.now(),
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
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
    setCurrentProject(project)
    return project
  }

  const updateProject = (updates) => {
    if (!currentProject) return
    const updated = {
      ...currentProject,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    setCurrentProject(updated)
  }

  const saveProject = async () => {
    if (!currentProject) return
    setIsSaving(true)
    try {
      await window.electron.saveProject(currentProject)
      setLastSaved(new Date())
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const loadProject = async (filePath) => {
    try {
      const project = await window.electron.loadProject(filePath)
      setCurrentProject(project)
      return project
    } catch (err) {
      console.error('Load failed:', err)
      return null
    }
  }

  const closeProject = () => {
    setCurrentProject(null)
  }

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projects,
        isSaving,
        lastSaved,
        createProject,
        updateProject,
        saveProject,
        loadProject,
        closeProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectStore = () => {
  const context = useContext(ProjectContext)
  if (!context) throw new Error('useProjectStore must be used inside ProjectProvider')
  return context
}

export default ProjectContext