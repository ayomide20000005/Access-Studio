import { Img, staticFile } from 'remotion'

export const ImageLayer = ({ src, style = {}, alt = '' }) => {
  if (!src) return null

  const isRemote = src.startsWith('http') || src.startsWith('file://')
  const source = isRemote ? src : staticFile(src)

  return (
    <Img
      src={source}
      alt={alt}
      style={{
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}