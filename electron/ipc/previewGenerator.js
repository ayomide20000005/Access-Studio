const path = require('path')
const fs = require('fs-extra')
const { app } = require('electron')

const BUILT_IN_PREVIEWS_DIR = path.join(__dirname, '../../src/remotion/templates')
const USER_TEMPLATES_DIR = path.join(app.getPath('userData'), 'user_templates')

const BUILT_IN_TEMPLATE_IDS = [
  'demo-video',
  'product-launch',
  'explainer-video',
  'promotional-video',
  'tutorial-video',
  'intro-outro',
  'social-media-clip',
  'pitch-deck-video',
  'resume-portfolio',
  'event-announcement',
]

async function getBuiltInPreviewPaths() {
  const paths = {}
  for (const id of BUILT_IN_TEMPLATE_IDS) {
    const previewPng = path.join(BUILT_IN_PREVIEWS_DIR, id, 'preview.png')
    const previewJpg = path.join(BUILT_IN_PREVIEWS_DIR, id, 'preview.jpg')
    if (await fs.pathExists(previewPng)) {
      paths[id] = previewPng
    } else if (await fs.pathExists(previewJpg)) {
      paths[id] = previewJpg
    }
  }
  return paths
}

async function getUserTemplatePreviewPath(folderPath) {
  const previewPng = path.join(folderPath, 'preview.png')
  const previewJpg = path.join(folderPath, 'preview.jpg')
  if (await fs.pathExists(previewPng)) return previewPng
  if (await fs.pathExists(previewJpg)) return previewJpg
  return null
}

module.exports = {
  getBuiltInPreviewPaths,
  getUserTemplatePreviewPath,
}