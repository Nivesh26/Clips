import { useState } from 'react'
import Hero from '../Components/Hero'
import {
  FiYoutube,
  FiArrowRight,
  FiDownload,
  FiVideo,
  FiMusic,
  FiCheck,
  FiX,
  FiScissors,
  FiClock,
} from 'react-icons/fi'

const Youtube = () => {
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<'clips' | 'download'>('clips')
  const [selectedQuality, setSelectedQuality] = useState('1080p')
  const [selectedDuration, setSelectedDuration] = useState('30s')
  const [selectedAspect, setSelectedAspect] = useState('9:16')
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const extractYouTubeId = (inputUrl: string) => {
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    const match = inputUrl.match(regExp)
    return match ? match[1] : null
  }

  const videoId = extractYouTubeId(url)

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      setSubmitted(true)
      setSuccessMessage('')
    }
  }

  const handleAction = () => {
    setIsProcessing(true)
    setSuccessMessage('')
    setTimeout(() => {
      setIsProcessing(false)
      if (mode === 'clips') {
        setSuccessMessage(`Created ${selectedDuration} clips (${selectedAspect})!`)
      } else {
        setSuccessMessage(`Download started (${selectedQuality.toUpperCase()})!`)
      }
      setTimeout(() => setSuccessMessage(''), 3000)
    }, 1200)
  }

  const handleClear = () => {
    setUrl('')
    setSubmitted(false)
    setSuccessMessage('')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Hero />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-5">
            <FiYoutube className="w-5 h-5 text-zinc-400" />
            <div>
              <h2 className="text-sm font-medium text-zinc-200">YouTube Clipper & Downloader</h2>
              <p className="text-xs text-zinc-500">Paste any public link to start or download</p>
            </div>
          </div>

          <form onSubmit={handleFetch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (!e.target.value.trim()) {
                    setSubmitted(false)
                  }
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5 cursor-pointer"
                  aria-label="Clear input"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!url.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 text-zinc-950 font-medium rounded-md text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Fetch</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Options - visible when link is submitted or entered */}
          {(submitted || (url.trim().length > 10 && videoId)) && (
            <div className="mt-6 pt-6 border-t border-zinc-800">
              {/* Video Preview Card */}
              <div className="flex gap-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg mb-5">
                {videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt="YouTube Video Thumbnail"
                    className="w-32 h-20 object-cover rounded-md border border-zinc-800 shrink-0"
                  />
                ) : (
                  <div className="w-32 h-20 bg-zinc-800 rounded-md flex items-center justify-center shrink-0 text-zinc-500">
                    <FiVideo className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                      {videoId ? `YouTube Video (${videoId})` : 'YouTube Video'}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{url}</p>
                  </div>
                  <span className="text-[11px] text-zinc-400">Ready to download or clip</span>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg mb-5 w-fit">
                <button
                  type="button"
                  onClick={() => setMode('clips')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'clips'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FiScissors className="w-3.5 h-3.5" />
                  <span>Make Clips</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('download')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'download'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Download Video</span>
                </button>
              </div>

              {/* Make Clips Options */}
              {mode === 'clips' && (
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">
                      Choose Clip Duration
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: '30s', label: '30 sec', desc: 'Shorts & Reels', icon: FiClock },
                        { id: '60s', label: '60 sec', desc: 'Standard', icon: FiClock },
                        { id: '90s', label: '90 sec', desc: 'Extended', icon: FiClock },
                        { id: 'auto', label: 'Auto', desc: 'Best Highlights', icon: FiScissors },
                      ].map((item) => {
                        const Icon = item.icon
                        const isSelected = selectedDuration === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedDuration(item.id)}
                            className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <Icon className="w-3.5 h-3.5" />
                              {isSelected && <FiCheck className="w-3 h-3 text-zinc-200" />}
                            </div>
                            <span className="text-xs font-semibold">{item.label}</span>
                            <span className="text-[10px] text-zinc-500">{item.desc}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Aspect Ratio Options */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: '9:16', label: '9:16 Vertical', desc: 'TikTok, Reels, Shorts' },
                        { id: '16:9', label: '16:9 Landscape', desc: 'Original Aspect' },
                      ].map((aspect) => {
                        const isSelected = selectedAspect === aspect.id
                        return (
                          <button
                            key={aspect.id}
                            type="button"
                            onClick={() => setSelectedAspect(aspect.id)}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div>
                              <span className="text-xs font-semibold block">{aspect.label}</span>
                              <span className="text-[10px] text-zinc-500">{aspect.desc}</span>
                            </div>
                            {isSelected && <FiCheck className="w-3 h-3 text-zinc-200 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Download Format / Quality Selection */}
              {mode === 'download' && (
                <div className="mb-5">
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Select Format & Quality
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: '1080p', label: '1080p', desc: 'MP4 Full HD', icon: FiVideo },
                      { id: '720p', label: '720p', desc: 'MP4 HD', icon: FiVideo },
                      { id: '480p', label: '480p', desc: 'MP4 SD', icon: FiVideo },
                      { id: 'mp3', label: 'Audio', desc: 'MP3 320k', icon: FiMusic },
                    ].map((format) => {
                      const Icon = format.icon
                      const isSelected = selectedQuality === format.id
                      return (
                        <button
                          key={format.id}
                          type="button"
                          onClick={() => setSelectedQuality(format.id)}
                          className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <Icon className="w-3.5 h-3.5" />
                            {isSelected && <FiCheck className="w-3 h-3 text-zinc-200" />}
                          </div>
                          <span className="text-xs font-semibold">{format.label}</span>
                          <span className="text-[10px] text-zinc-500">{format.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAction}
                  disabled={isProcessing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 font-medium rounded-md text-sm hover:bg-white disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {mode === 'clips' ? (
                    <FiScissors className="w-4 h-4" />
                  ) : (
                    <FiDownload className="w-4 h-4" />
                  )}
                  <span>
                    {isProcessing
                      ? mode === 'clips'
                        ? 'Creating Clips...'
                        : 'Downloading...'
                      : successMessage
                      ? successMessage
                      : mode === 'clips'
                      ? `Make ${selectedDuration === 'auto' ? 'Auto' : selectedDuration} Clips (${selectedAspect})`
                      : `Download (${selectedQuality.toUpperCase()})`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Youtube
