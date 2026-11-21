import { useEffect, useState } from 'react'
import Hero from '../Components/Hero'
import { FiClock, FiTrash2, FiExternalLink, FiVideo, FiRefreshCw } from 'react-icons/fi'
import { fetchReelClips, deleteReelClip, checkBackendHealth, type ReelClip } from '../services/api'

const History = () => {
  const [clips, setClips] = useState<ReelClip[]>([])
  const [loading, setLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    let isCancelled = false

    const load = async () => {
      try {
        const health = await checkBackendHealth()
        if (isCancelled) return
        setDbStatus(health.database === 'connected' ? 'connected' : 'disconnected')
        if (health.database === 'connected') {
          const data = await fetchReelClips()
          if (!isCancelled) setClips(data)
        } else {
          if (!isCancelled) setClips([])
        }
      } catch {
        if (!isCancelled) {
          setDbStatus('disconnected')
          setClips([])
        }
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    load()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleManualRefresh = async () => {
    setLoading(true)
    try {
      const health = await checkBackendHealth()
      setDbStatus(health.database === 'connected' ? 'connected' : 'disconnected')
      if (health.database === 'connected') {
        const data = await fetchReelClips()
        setClips(data)
      } else {
        setClips([])
      }
    } catch {
      setDbStatus('disconnected')
      setClips([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteReelClip(id)
      setClips((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error('Failed to delete clip:', err)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Hero />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Saved Reel Clips</h2>
            <p className="text-xs text-zinc-400">
              Only edited 9:16 vertical reels saved in MongoDB
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* MongoDB Connection Status Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                dbStatus === 'connected'
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  dbStatus === 'connected' ? 'bg-emerald-400' : 'bg-zinc-500'
                }`}
              />
              MongoDB: {dbStatus === 'connected' ? 'Connected' : 'Offline'}
            </span>

            <button
              type="button"
              onClick={handleManualRefresh}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-md bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Refresh"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            Loading reel clips...
          </div>
        ) : clips.length === 0 ? (
          <div className="border border-zinc-800 rounded-xl p-12 bg-zinc-900/20 text-center max-w-lg mx-auto">
            <FiClock className="w-7 h-7 mx-auto mb-3 text-zinc-500" />
            <h3 className="text-sm font-medium text-zinc-200 mb-1">No edited reels saved yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
              When you generate 30s or 60s reel clips from YouTube or local videos, they will automatically be stored here in MongoDB.
            </p>
            {dbStatus === 'disconnected' && (
              <p className="text-[11px] text-zinc-500 font-mono bg-zinc-900/70 py-1.5 px-3 rounded border border-zinc-800/80 inline-block">
                Start Python API: <span className="text-zinc-300">uvicorn app.main:app --port 8000</span>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="group border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  {/* 9:16 Aspect ratio container */}
                  <div className="relative aspect-[9/16] max-h-56 w-full bg-zinc-900 border-b border-zinc-800 overflow-hidden flex items-center justify-center">
                    {clip.thumbnail_url ? (
                      <img
                        src={clip.thumbnail_url}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiVideo className="w-8 h-8 text-zinc-600" />
                    )}

                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-950/80 backdrop-blur-sm text-zinc-200 border border-zinc-700">
                        {clip.duration}s
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-950/80 backdrop-blur-sm text-zinc-400 border border-zinc-800">
                        9:16 Reel
                      </span>
                    </div>

                    {clip.source_url && (
                      <a
                        href={clip.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 p-1.5 rounded-md bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-800"
                        title="Open Source"
                      >
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="p-3.5">
                    <h3 className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                      {clip.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5 capitalize">
                      Source: {clip.source_type} • {new Date(clip.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(clip.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <FiTrash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default History
