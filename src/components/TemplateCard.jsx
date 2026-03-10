export default function TemplateCard({ template, isHovered, onHover, onSelect }) {
  return (
    <div
      className="relative rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isHovered ? template.color : 'var(--border)'}`,
        boxShadow: isHovered ? `0 0 24px ${template.color}33, 0 8px 32px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.2)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(template)}
    >
      {/* Thumbnail area */}
      <div
        className="w-full h-36 flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${template.color}22 0%, var(--panel) 100%)`,
        }}
      >
        {/* Animated background on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at center, ${template.color}33 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Icon */}
        <span
          className="text-5xl relative z-10 transition-transform duration-200"
          style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
        >
          {template.icon}
        </span>

        {/* Play badge on hover */}
        {isHovered && (
          <div
            className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
            style={{ background: template.color, color: '#fff' }}
          >
            ▶ Use
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {template.name}
          </h3>
          <span
            className="text-xs transition-colors duration-200"
            style={{ color: isHovered ? template.color : 'var(--muted)' }}
          >
            →
          </span>
        </div>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
          {template.description}
        </p>

        {/* Field tags */}
        <div className="flex flex-wrap gap-1">
          {template.fields.slice(0, 3).map(field => (
            <span
              key={field}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: `${template.color}18`,
                color: template.color,
              }}
            >
              {field}
            </span>
          ))}
          {template.fields.length > 3 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--panel)', color: 'var(--muted)' }}
            >
              +{template.fields.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}