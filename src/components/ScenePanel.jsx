export default function ScenePanel({
  scenes,
  selectedScene,
  onSceneSelect,
  onAddScene,
  onDeleteScene,
}) {
  return (
    <div className="p-3 flex flex-col gap-2">
      {scenes.map(scene => (
        <div
          key={scene.id}
          onClick={() => onSceneSelect(scene.id)}
          className="relative group rounded-lg border cursor-pointer transition-all duration-150 overflow-hidden"
          style={{
            borderColor: selectedScene === scene.id ? '#7C3AED' : '#2E2E2E',
            background: selectedScene === scene.id ? '#7C3AED11' : '#242424',
          }}
        >
          {/* Scene Thumbnail */}
          <div className="w-full h-20 bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
            <span className="text-xs text-gray-500">{scene.name}</span>
          </div>

          {/* Scene Info */}
          <div className="px-2 py-1.5 flex items-center justify-between">
            <span className="text-xs text-text font-medium">{scene.name}</span>
            <span className="text-xs text-muted">{(scene.duration / 30).toFixed(1)}s</span>
          </div>

          {/* Delete button */}
          {scenes.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteScene(scene.id)
              }}
              className="absolute top-1 right-1 w-5 h-5 rounded bg-black bg-opacity-60 text-muted hover:text-red-400 text-xs items-center justify-center hidden group-hover:flex transition-colors"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* Add Scene */}
      <button
        onClick={onAddScene}
        className="w-full h-10 rounded-lg border border-dashed border-border hover:border-primary text-muted hover:text-primary text-xs transition-all duration-150 flex items-center justify-center gap-1"
      >
        + Add Scene
      </button>
    </div>
  )
}