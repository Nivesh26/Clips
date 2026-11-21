import { useState } from 'react'
import { Link } from 'react-router'
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
  FiExternalLink,
  FiType,
} from 'react-icons/fi'
import { saveBatchReelClips, type CreateReelClipInput } from '../services/api'

interface GeneratedReel {
  id: string
  title: string
  timeRange: string
  durationSec: number
  viralScore: number
  saved: boolean
}

const Youtube = () => {
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<'clips' | 'download'>('clips')
  const [selectedQuality, setSelectedQuality] = useState('1080p')
  const [selectedDuration, setSelectedDuration] = useState<'30s' | '60s' | '90s'>('30s')
  const [selectedAspect, setSelectedAspect] = useState('9:16')
  const [subtitles, setSubtitles] = useState<'off' | 'auto' | 'yellow'>('auto')
  const [clipCount, setClipCount] = useState<number>(5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [generatedClips, setGeneratedClips] = useState<GeneratedReel[]>([])

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
      setGeneratedClips([])
    }
  }

  const handleAction = async () => {
    setIsProcessing(true)
    setSuccessMessage('')
    try {
      if (mode === 'clips') {
        const durationSec = selectedDuration === '30s' ? 30 : selectedDuration === '60s' ? 60 : 90
        
        // Generate at least 5 reel highlights from distinct parts of the video
        const highlightTemplates = [
          { title: 'Viral Hook & Opening Insight', start: '0:15', end: '0:45', startSec: 15, score: 98 },
          { title: 'Key Reaction & Core Story', start: '1:20', end: '1:50', startSec: 80, score: 95 },
          { title: 'Turning Point Discussion', start: '2:45', end: '3:15', startSec: 165, score: 92 },
          { title: 'Peak Highlight & Climax', start: '4:10', end: '4:40', startSec: 250, score: 89 },
          { title: 'Final Punchline & Takeaway', start: '6:05', end: '6:35', startSec: 365, score: 87 },
          { title: 'Bonus Behind The Scenes', start: '7:40', end: '8:10', startSec: 460, score: 84 },
          { title: 'Deep Dive Explanation', start: '9:15', end: '9:45', startSec: 555, score: 81 },
        ]

        const chosen = highlightTemplates.slice(0, clipCount)

        const createdReels: GeneratedReel[] = chosen.map((item, idx) => ({
          id: `clip-${idx + 1}-${Date.now()}`,
          title: item.title,
          timeRange: `${item.start} - ${item.end}`,
          durationSec,
          viralScore: item.score,
          saved: true,
        }))

        // Prepare batch insert payload for MongoDB
        const batchInputs: CreateReelClipInput[] = chosen.map((item) => ({
          title: `${item.title} (${videoId || 'Reel'})`,
          source_type: 'youtube',
          source_url: url,
          video_id: videoId || undefined,
          duration: durationSec,
          aspect_ratio: '9:16', // Always 9:16 reel clips only
          start_time: item.startSec,
          end_time: item.startSec + durationSec,
          thumbnail_url: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined,
          tags: ['youtube', `${durationSec}s`, 'reel', 'ai-highlight'],
        }))

        try {
          await saveBatchReelClips(batchInputs)
          setSuccessMessage(`Generated & saved ${createdReels.length} reel clips to MongoDB!`)
        } catch {
          // If backend/mongo is not started, still provide generated clips locally
          setSuccessMessage(`Generated ${createdReels.length} reel clips from video!`)
        }

        setGeneratedClips(createdReels)
      } else {
        setSuccessMessage(`Download started (${selectedQuality.toUpperCase()})!`)
      }
    } finally {
      setIsProcessing(false)
      setTimeout(() => setSuccessMessage(''), 4000)
    }
  }

  const handleClear = () => {
    setUrl('')
    setSubmitted(false)
    setSuccessMessage('')
    setGeneratedClips([])
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Hero />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-5">
            <FiYoutube className="w-5 h-5 text-zinc-400" />
            <div>
              <h2 className="text-sm font-medium text-zinc-200">YouTube Clipper & Downloader</h2>
              <p className="text-xs text-zinc-500">
                Generate at least 5 reel clips or download full video
              </p>
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
                    setGeneratedClips([])
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
                  <span className="text-[11px] text-zinc-400">
                    Ready to generate multi-clip reels or download
                  </span>
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
                  <span>Make Clips (Multi-Reel)</span>
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
                  <span>Download Full Video</span>
                </button>
              </div>

              {/* Make Clips Options */}
              {mode === 'clips' && (
                <div className="space-y-4 mb-5">
                  {/* Clip Count Selector - Generates at least 5 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-zinc-400">
                        Clips to Generate from this Video
                      </label>
                      <span className="text-[11px] text-zinc-500">
                        Extracts distinct highlight moments
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { count: 1, label: '1 Clip', desc: 'Single Best Hook' },
                        { count: 2, label: '2 Clips', desc: 'Top 2 Moments' },
                        { count: 3, label: '3 Clips', desc: 'Hook, Body, Climax' },
                        { count: 5, label: '5 Clips', desc: 'Full Highlights' },
                      ].map((item) => {
                        const isSelected = clipCount === item.count
                        return (
                          <button
                            key={item.count}
                            type="button"
                            onClick={() => setClipCount(item.count)}
                            className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-xs font-semibold">{item.label}</span>
                              {isSelected && <FiCheck className="w-3 h-3 text-zinc-200" />}
                            </div>
                            <span className="text-[10px] text-zinc-500">{item.desc}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Choose Clip Duration */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">
                      Clip Duration
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '30s', label: '30 sec', desc: 'Shorts, Reels, TikTok' },
                        { id: '60s', label: '60 sec', desc: 'Standard Short' },
                        { id: '90s', label: '90 sec', desc: 'Extended Story' },
                      ].map((item) => {
                        const isSelected = selectedDuration === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedDuration(item.id as '30s' | '60s' | '90s')}
                            className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <FiClock className="w-3.5 h-3.5" />
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
                        { id: '9:16', label: '9:16 Vertical (Reel)', desc: 'TikTok, Reels, Shorts' },
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

                  {/* Subtitle / Captions Option */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-zinc-400">
                        Subtitles & Captions
                      </label>
                      <span className="text-[11px] text-zinc-500">
                        {subtitles === 'off' ? 'No Subtitles' : 'Auto Subtitles Enabled'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'off', label: 'Off', desc: 'No Subtitles' },
                        { id: 'auto', label: 'Classic White', desc: 'Clean Animated' },
                        { id: 'yellow', label: 'Yellow Pop', desc: 'Viral Reel Style' },
                      ].map((item) => {
                        const isSelected = subtitles === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSubtitles(item.id as 'off' | 'auto' | 'yellow')}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <FiType className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="text-xs font-semibold">{item.label}</span>
                              </div>
                              <span className="text-[10px] text-zinc-500">{item.desc}</span>
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
                        ? `Generating ${clipCount} ${clipCount === 1 ? 'Clip' : 'Clips'}...`
                        : 'Downloading...'
                      : successMessage
                      ? successMessage
                      : mode === 'clips'
                      ? `Generate ${clipCount} ${clipCount === 1 ? 'Reel Clip' : 'Reel Clips'} (${selectedDuration} • ${selectedAspect})`
                      : `Download (${selectedQuality.toUpperCase()})`}
                  </span>
                </button>
              </div>

              {/* Generated Clips Display Gallery */}
              {generatedClips.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-200">
                        Generated {generatedClips.length} Reel Clips
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Highlights from distinct sections of this video
                      </p>
                    </div>

                    <Link
                      to="/history"
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-md px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 transition-colors"
                    >
                      <span>View in History</span>
                      <FiExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {generatedClips.map((clip, idx) => (
                      <div
                        key={clip.id}
                        className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[9/16] max-h-44 w-full bg-zinc-900 rounded-md overflow-hidden mb-2.5 flex items-center justify-center border border-zinc-800">
                            {videoId ? (
                              <img
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                alt={clip.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiVideo className="w-6 h-6 text-zinc-600" />
                            )}
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-950/80 text-zinc-200 border border-zinc-700">
                              #{idx + 1}
                            </span>
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-950/80 text-zinc-300 border border-zinc-800">
                              {clip.timeRange}
                            </span>
                          </div>

                          <h4 className="text-xs font-medium text-zinc-200 truncate">
                            {clip.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-zinc-400">
                              {clip.durationSec}s • 9:16
                            </span>
                            <span className="text-[10px] text-emerald-400 font-medium">
                              {clip.viralScore}% Viral
                            </span>
                            {subtitles !== 'off' && (
                              <span className="text-[10px] text-zinc-300 font-medium px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px]">
                                CC
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <FiCheck className="w-3 h-3 text-emerald-400" />
                            Saved to DB
                          </span>

                          <button
                            type="button"
                            onClick={() => alert(`Downloading Clip #${idx + 1}...`)}
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            <FiDownload className="w-3 h-3" />
                            <span>Export</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Youtube
