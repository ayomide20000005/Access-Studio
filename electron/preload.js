const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  // Dialog
  openFile: (filters) => ipcRenderer.invoke('dialog:openFile', filters),
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  saveFile: (filters) => ipcRenderer.invoke('dialog:saveFile', filters),

  // Window controls
  minimize: () => ipcRenderer.invoke('app:minimize'),
  maximize: () => ipcRenderer.invoke('app:maximize'),
  close: () => ipcRenderer.invoke('app:close'),

  // FFmpeg
  renderVideo: (options) => ipcRenderer.invoke('ffmpeg:render', options),
  exportVideo: (options) => ipcRenderer.invoke('ffmpeg:export', options),

  // Project
  saveProject: (data) => ipcRenderer.invoke('project:save', data),
  loadProject: (filePath) => ipcRenderer.invoke('project:load', filePath),
  listProjects: () => ipcRenderer.invoke('project:list'),
  deleteProject: (filePath) => ipcRenderer.invoke('project:delete', filePath),

  // Assets
  importAsset: (filePath) => ipcRenderer.invoke('asset:import', filePath),
  listAssets: () => ipcRenderer.invoke('asset:list'),
  deleteAsset: (filePath) => ipcRenderer.invoke('asset:delete', filePath),

  // Templates
  importTemplate: (folderPath) => ipcRenderer.invoke('template:import', folderPath),
  listTemplates: () => ipcRenderer.invoke('template:list'),
  deleteTemplate: (templateId) => ipcRenderer.invoke('template:delete', templateId),
  updateTemplate: (templateId, updates) => ipcRenderer.invoke('template:update', { templateId, updates }),

  // Events
  on: (channel, callback) => {
    const validChannels = ['export:progress', 'export:complete', 'export:error']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, data) => callback(data))
    }
  },
  off: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },
})