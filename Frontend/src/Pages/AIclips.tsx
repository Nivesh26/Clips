import Hero from '../Components/Hero'
import { FiScissors } from 'react-icons/fi'

const AIclips = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Hero />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-6">
            <FiScissors className="w-5 h-5 text-zinc-400" />
            <div>
              <h2 className="text-sm font-medium text-zinc-200">Auto Clip Generator</h2>
              <p className="text-xs text-zinc-500">Detect highlights and trim automatically</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Clip Duration</label>
              <select className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 focus:outline-none focus:border-zinc-700">
                <option value="30">30 seconds (Shorts / Reels)</option>
                <option value="60">60 seconds (Standard)</option>
                <option value="auto">Auto-detect best moments</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Source Video</label>
              <div className="border border-dashed border-zinc-800 rounded-md p-6 text-center text-xs text-zinc-400 cursor-pointer hover:border-zinc-700 transition-colors">
                Drop video here or click to browse
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AIclips
