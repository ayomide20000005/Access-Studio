const { ipcMain, app } = require('electron')
const path = require('path')
const fs = require('fs-extra')

const TEMPLATES_DIR = path.join(app.getPath('userData'), 'user_templates')

// Ensure templates directory exists
fs.ensureDir(TEMPLATES_DIR)

// Field type auto detection helpers
function detectFieldType(key, value) {
  const k = key.toLowerCase()

  if (k.includes('color') || k.includes('colour')) return 'color'
  if (k.includes('date')) return 'date'
  if (k.includes('logo') || k.includes('photo') || k.includes('image') || k.includes('picture')) return 'image'
  if (k.includes('video') || k.includes('footage') || k.includes('clip')) return 'video'
  if (k.includes('audio') || k.includes('music') || k.includes('sound')) return 'audio'
  if (k.includes('show') || k.includes('hide') || k.includes('enable') || k.includes('visible')) return 'toggle'
  if (k.includes('speed') || k.includes('opacity') || k.includes('size') || k.includes('scale')) return 'slider'
  if (k.includes('steps') || k.includes('features') || k.includes('benefits') || k.includes('list') || k.includes('items')) return 'list'
  if (k.includes('font')) return 'font'
  if (k.includes('description') || k.includes('content') || k.includes('text') || k.includes('bio') || k.includes('about') || k.includes('summary')) return 'textarea'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'toggle'

  return 'text'
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

function autoDetectFields(defaultProps) {
  if (!defaultProps) return []

  return Object.entries(defaultProps)
    .filter(([key]) => key !== 'fontFamily')
    .map(([key, value]) => ({
      key,
      label: formatLabel(key),
      type: detectFieldType(key, value),
      placeholder: typeof value === 'string' && value ? `e.g. ${value}` : '',
      default: value,
    }))
}

function extractDefaultProps(code) {
  try {
    const match = code.match(/defaultProps\s*=\s*({[\s\S]*?})\s*\n/)
    if (!match) return null
    // Safe parse attempt
    const cleaned = match[1]
      .replace(/\/\/.*/g, '')
      .replace(/,\s*}/g, '}')
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

function findMainFile(folderPath, files) {
  const candidates = ['index.js', 'index.jsx', 'composition.js', 'composition.jsx', 'template.js', 'template.jsx']
  for (const candidate of candidates) {
    if (files.includes(candidate)) return path.join(folderPath, candidate)
  }
  const jsx = files.find(f => f.endsWith('.jsx'))
  const js = files.find(f => f.endsWith('.js') && f !== 'template.config.json')
  return jsx ? path.join(folderPath, jsx) : js ? path.join(folderPath, js) : null
}

// Import a template folder
ipcMain.handle('template:import', async (_, folderPath) => {
  try {
    const files = await fs.readdir(folderPath)
    const folderName = path.basename(folderPath)
    const destPath = path.join(TEMPLATES_DIR, folderName)

    // Copy folder to user templates dir
    await fs.copy(folderPath, destPath, { overwrite: true })

    let config = null
    let fields = []
    let styles = {}
    let detectionMethod = 'generic'

    // Level 1 — check for config file
    if (files.includes('template.config.json')) {
      const configRaw = await fs.readFile(path.join(folderPath, 'template.config.json'), 'utf8')
      config = JSON.parse(configRaw)
      fields = config.fields || []
      styles = config.styles || {}
      detectionMethod = 'config'
    } else {
      // Level 2 — try to extract defaultProps from code
      const mainFile = findMainFile(folderPath, files)
      if (mainFile) {
        const code = await fs.readFile(mainFile, 'utf8')
        const defaultProps = extractDefaultProps(code)
        if (defaultProps) {
          fields = autoDetectFields(defaultProps)
          detectionMethod = 'autoDetect'
        }
      }

      // Level 3 — generic fallback fields
      if (fields.length === 0) {
        fields = [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Your Title' },
          { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'e.g. Your Subtitle' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g. Your Description' },
          { key: 'callToAction', label: 'Call to Action', type: 'text', placeholder: 'e.g. Get Started' },
          { key: 'primaryColor', label: 'Primary Color', type: 'color', default: '#7C3AED' },
        ]
        detectionMethod = 'generic'
      }

      // Build a config and save it
      config = {
        id: folderName.toLowerCase().replace(/\s+/g, '-'),
        name: config?.name || formatLabel(folderName),
        description: config?.description || 'Custom template',
        version: '1.0.0',
        author: 'Unknown',
        composition: config?.composition || 'MainComposition',
        fields,
        styles,
      }

      await fs.writeFile(
        path.join(destPath, 'template.config.json'),
        JSON.stringify(config, null, 2),
        'utf8'
      )
    }

    const template = {
      id: config.id || folderName.toLowerCase().replace(/\s+/g, '-'),
      name: config.name || formatLabel(folderName),
      description: config.description || 'Custom template',
      composition: config.composition || 'MainComposition',
      icon: '📦',
      color: '#7C3AED',
      fields,
      styles,
      folderPath: destPath,
      isCustom: true,
      detectionMethod,
    }

    return { success: true, template }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// List all user templates
ipcMain.handle('template:list', async () => {
  try {
    await fs.ensureDir(TEMPLATES_DIR)
    const folders = await fs.readdir(TEMPLATES_DIR)
    const templates = []

    for (const folder of folders) {
      const configPath = path.join(TEMPLATES_DIR, folder, 'template.config.json')
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJSON(configPath)
        templates.push({
          ...config,
          icon: '📦',
          color: config.color || '#7C3AED',
          folderPath: path.join(TEMPLATES_DIR, folder),
          isCustom: true,
        })
      }
    }

    return { success: true, templates }
  } catch (err) {
    return { success: false, error: err.message, templates: [] }
  }
})

// Delete a user template
ipcMain.handle('template:delete', async (_, templateId) => {
  try {
    const folders = await fs.readdir(TEMPLATES_DIR)
    for (const folder of folders) {
      const configPath = path.join(TEMPLATES_DIR, folder, 'template.config.json')
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJSON(configPath)
        if (config.id === templateId) {
          await fs.remove(path.join(TEMPLATES_DIR, folder))
          return { success: true }
        }
      }
    }
    return { success: false, error: 'Template not found' }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Update a user template config
ipcMain.handle('template:update', async (_, { templateId, updates }) => {
  try {
    const folders = await fs.readdir(TEMPLATES_DIR)
    for (const folder of folders) {
      const configPath = path.join(TEMPLATES_DIR, folder, 'template.config.json')
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJSON(configPath)
        if (config.id === templateId) {
          const updated = { ...config, ...updates }
          await fs.writeJSON(configPath, updated, { spaces: 2 })
          return { success: true, template: updated }
        }
      }
    }
    return { success: false, error: 'Template not found' }
  } catch (err) {
    return { success: false, error: err.message }
  }
})