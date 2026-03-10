import { Video, staticFile, useVideoConfig, useCurrentFrame } from 'remotion'

export const VideoLayer = ({
  src,
  style = {},
  volume = 1,
  startFrom = 0,
  endAt,
  loop = false,
  muted = false,
}) => {
  if (!src) return null

  const isRemote = src.startsWith('http') || src.startsWith('file://')
  const source = isRemote ? src : staticFile(src)

  return (
    <Video
      src={source}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }}
      volume={muted ? 0 : volume}
      startFrom={startFrom}
      endAt={endAt}
      loop={loop}
    />
  )
}