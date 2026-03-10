const { ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs-extra')
const { saveProject, loadProject, listProjects, deleteProject, autoSave } = require('../../src/utils/projectManager')

const getDefaultProjectsDir = () => {
  const appData = process.env.APPDATA || process.env.HOME
  return path.join(appData, 'acces-studio', 'projects')
}

// Save project
ipcMain.handle('project:save', async (event, projectData) => {
  try {
    const result = await dialog.showSaveDialog({
      title: 'Save Project',
      defaultPath: path.join(getDefaultProjectsDir(), `${projectData.name}.acces`),
      filters: [{ name: 'Acces Studio Project', extensions: ['acces'] }],
    })

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true }
    }

    return await saveProject(projectData, result.filePath)
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Load project
ipcMain.handle('project:load', async (event, filePath) => {
  try {
    const result = await loadProject(filePath)
    if (!result.success) return result
    return { success: true, project: result.project }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// List all projects
ipcMain.handle('project:list', async () => {
  try {
    const projects = await listProjects()
    return { success: true, projects }
  } catch (err) {
    return { success: false, error: err.message, projects: [] }
  }
})

// Delete project
ipcMain.handle('project:delete', async (event, filePath) => {
  try {
    return await deleteProject(filePath)
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Auto save
ipcMain.handle('project:autosave', async (event, projectData) => {
  try {
    return await autoSave(projectData)
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Asset import
ipcMain.handle('asset:import', async (event, sourcePath) => {
  try {
    const { importAsset } = require('../../src/utils/assetManager')
    return await importAsset(sourcePath)
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Asset list
ipcMain.handle('asset:list', async () => {
  try {
    const { listAssets } = require('../../src/utils/assetManager')
    const assets = await listAssets()
    return { success: true, assets }
  } catch (err) {
    return { success: false, error: err.message, assets: [] }
  }
})

// Asset delete
ipcMain.handle('asset:delete', async (event, filePath) => {
  try {
    const { deleteAsset } = require('../../src/utils/assetManager')
    return await deleteAsset(filePath)
  } catch (err) {
    return { success: false, error: err.message }
  }
})