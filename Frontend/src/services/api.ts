export interface ReelClip {
  id: string
  title: string
  source_type: 'youtube' | 'local' | 'ai'
  source_url?: string
  video_id?: string
  duration: number
  aspect_ratio: string
  start_time?: number
  end_time?: number
  clip_url?: string
  thumbnail_url?: string
  tags?: string[]
  status: string
  created_at: string
}

export interface CreateReelClipInput {
  title: string
  source_type: 'youtube' | 'local' | 'ai'
  source_url?: string
  video_id?: string
  duration: number
  aspect_ratio?: string
  start_time?: number
  end_time?: number
  clip_url?: string
  thumbnail_url?: string
  tags?: string[]
}

const API_BASE = 'http://localhost:8000/api'

export async function fetchReelClips(): Promise<ReelClip[]> {
  const res = await fetch(`${API_BASE}/clips`)
  if (!res.ok) {
    throw new Error(`Failed to fetch reel clips: ${res.statusText}`)
  }
  return res.json()
}

export async function saveReelClip(input: CreateReelClipInput): Promise<ReelClip> {
  const res = await fetch(`${API_BASE}/clips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      aspect_ratio: '9:16', // Always 9:16 reel clips only
    }),
  })
  if (!res.ok) {
    throw new Error(`Failed to save reel clip: ${res.statusText}`)
  }
  return res.json()
}

export async function saveBatchReelClips(inputs: CreateReelClipInput[]): Promise<ReelClip[]> {
  const res = await fetch(`${API_BASE}/clips/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      inputs.map((input) => ({
        ...input,
        aspect_ratio: '9:16', // Always 9:16 reel clips only
      }))
    ),
  })
  if (!res.ok) {
    throw new Error(`Failed to save batch reel clips: ${res.statusText}`)
  }
  return res.json()
}

export async function deleteReelClip(clipId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/clips/${clipId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error(`Failed to delete reel clip: ${res.statusText}`)
  }
}

export async function checkBackendHealth(): Promise<{ status: string; database: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`)
    if (!res.ok) return { status: 'down', database: 'disconnected' }
    return res.json()
  } catch {
    return { status: 'down', database: 'disconnected' }
  }
}
