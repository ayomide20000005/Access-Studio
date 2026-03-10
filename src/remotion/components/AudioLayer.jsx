import { Audio, staticFile } from 'remotion'

export const AudioLayer = ({
  src,
  volume = 1,
  startFrom = 0,
  endAt,
  loop = false,
}) => {
  if (!src) return null

  const isRemote = src.startsWith('http') || src.startsWith('file://')
  const source = isRemote ? src : staticFile(src)

  return (
    <Audio
      src={source}
      volume={volume}
      startFrom={startFrom}
      endAt={endAt}
      loop={loop}
    />
  )
}