import { useState, createContext, useContext } from 'react'

const EditorContext = createContext(null)

export const EditorProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState('select')
  const [activePanel, setActivePanel] = useState('scenes')
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [selectedSceneId, setSelectedSceneId] = useState(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [clipboard, setClipboard] = useState(null)

  const pushHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(state)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      return history[historyIndex - 1]
    }
    return null
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      return history[historyIndex + 1]
    }
    return null
  }

  const copyLayer = (layer) => {
    setClipboard({ ...layer, id: null })
  }

  const pasteLayer = () => {
    if (!clipboard) return null
    return { ...clipboard, id: Date.now() }
  }

  const togglePlay = () => setIsPlaying(prev => !prev)

  const seekTo = (frame) => {
    setCurrentFrame(frame)
    if (isPlaying) setIsPlaying(false)
  }

  const zoomIn = () => setZoom(prev => Math.min(3, parseFloat((prev + 0.1).toFixed(1))))
  const zoomOut = () => setZoom(prev => Math.max(0.3, parseFloat((prev - 0.1).toFixed(1))))
  const resetZoom = () => setZoom(1)

  return (
    <EditorContext.Provider
      value={{
        activeTool,
        setActiveTool,
        activePanel,
        setActivePanel,
        selectedLayerId,
        setSelectedLayerId,
        selectedSceneId,
        setSelectedSceneId,
        currentFrame,
        setCurrentFrame,
        isPlaying,
        setIsPlaying,
        togglePlay,
        seekTo,
        zoom,
        setZoom,
        zoomIn,
        zoomOut,
        resetZoom,
        history,
        historyIndex,
        pushHistory,
        undo,
        redo,
        clipboard,
        copyLayer,
        pasteLayer,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export const useEditorStore = () => {
  const context = useContext(EditorContext)
  if (!context) throw new Error('useEditorStore must be used inside EditorProvider')
  return context
}

export default EditorContext