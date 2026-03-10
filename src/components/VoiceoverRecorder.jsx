import { useState, useRef, useEffect } from 'react'

export default function VoiceoverRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState(null)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const newRecording = {
          id: Date.now(),
          url,
          duration: recordingTime,
          name: `Voiceover ${recordings.length + 1}`,
        }
        setRecordings(prev => [...prev, newRecording])
        stream.getTracks().forEach(track => track.stop())
        setRecordingTime(0)
      }

      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(r => r.id !== id))
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="p-3 flex flex-col gap-4">
      {/* Record button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
          style={{
            background: isRecording ? '#DC2626' : '#7C3AED',
            boxShadow: isRecording ? '0 0 0 8px #DC262622' : '0 0 0 8px #7C3AED22',
          }}
        >
          {isRecording ? (
            <span className="w-5 h-5 bg-white rounded-sm" />
          ) : (
            <span className="text-2xl">🎙</span>
          )}
        </button>

        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}

        <p className="text-xs text-muted text-center">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center bg-red-400 bg-opacity-10 rounded-lg p-2">
          {error}
        </p>
      )}

      {/* Recordings list */}
      {recordings.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-2">Recordings</p>
          <div className="flex flex-col gap-2">
            {recordings.map(rec => (
              <div
                key={rec.id}
                className="bg-panel rounded-lg p-2 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text">{rec.name}</span>
                  <button
                    onClick={() => deleteRecording(rec.id)}
                    className="text-muted hover:text-red-400 text-sm transition-colors"
                  >
                    ×
                  </button>
                </div>
                <audio
                  src={rec.url}
                  controls
                  className="w-full h-8"
                  style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                />
                <div className="flex gap-1">
                  <button className="btn-primary text-xs py-1 px-2 flex-1">
                    Add to Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}