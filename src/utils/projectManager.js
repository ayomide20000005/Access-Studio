const fs = require('fs-extra')
const path = require('path')
const archiver = require('archiver')

// Projects directory
const getProjectsDir = () => {
  const appData = process.env.APPDATA || process.env.HOME
  return path.join(appData, 'acces-studio', 'projects')
}

const initProjectsDir = async () => {
  const dir = getProjectsDir()
  await fs.ensureDir(dir)
  return dir
}

// Save project as .acces file
const saveProject = async (projectData, filePath) => {
  try {
    await fs.ensureDir(path.dirname(filePath))
    const content = JSON.stringify(projectData, null, 2)
    await fs.writeFile(filePath, content, 'utf8')
    return { success: true, filePath }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Load project from .acces file
const loadProject = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const project = JSON.parse(content)
    return { success: true, project }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// List all saved projects
const listProjects = async () => {
  try {
    const dir = await initProjectsDir()
    const files = await fs.readdir(dir)
    const projects = []

    for (const file of files) {
      if (!file.endsWith('.acces')) continue
      const filePath = path.join(dir, file)
      const stat = await fs.stat(filePath)
      try {
        const content = await fs.readFile(filePath, 'utf8')
        const data = JSON.parse(content)
        projects.push({
          id: data.id,
          name: data.name,
          template: data.template,
          filePath,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          fileSize: stat.size,
        })
      } catch {
        continue
      }
    }

    return projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  } catch (err) {
    return []
  }
}

// Delete a project file
const deleteProject = async (filePath) => {
  try {
    await fs.remove(filePath)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Export project as shareable zip archive
const exportProjectArchive = async (projectData, outputPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve({ success: true, outputPath }))
    archive.on('error', (err) => reject(err))

    archive.pipe(output)
    archive.append(JSON.stringify(projectData, null, 2), { name: 'project.acces' })
    archive.finalize()
  })
}

// Auto-save project to default location
const autoSave = async (projectData) => {
  try {
    const dir = await initProjectsDir()
    const fileName = `${projectData.id}.acces`
    const filePath = path.join(dir, fileName)
    return saveProject(projectData, filePath)
  } catch (err) {
    return { success: false, error: err.message }
  }
}

module.exports = {
  getProjectsDir,
  initProjectsDir,
  saveProject,
  loadProject,
  listProjects,
  deleteProject,
  exportProjectArchive,
  autoSave,
}