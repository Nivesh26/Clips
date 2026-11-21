import Hero from '../Components/Hero'
import { FiYoutube, FiArrowRight } from 'react-icons/fi'

const Youtube = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Hero />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-5">
            <FiYoutube className="w-5 h-5 text-zinc-400" />
            <div>
              <h2 className="text-sm font-medium text-zinc-200">YouTube Clipper</h2>
              <p className="text-xs text-zinc-500">Paste any public link to start</p>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 text-zinc-950 font-medium rounded-md text-sm hover:bg-white transition-colors cursor-pointer"
            >
              <span>Fetch</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Youtube
