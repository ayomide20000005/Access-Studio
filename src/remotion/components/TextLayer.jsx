export const TextLayer = ({ text, style = {} }) => {
  if (!text) return null

  return (
    <div
      style={{
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {text}
    </div>
  )
}