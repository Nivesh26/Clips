import Hero from '../Components/Hero'
import { FiClock } from 'react-icons/fi'

const History = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Hero />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-full border border-zinc-800 rounded-xl p-10 bg-zinc-900/20">
          <FiClock className="w-6 h-6 mx-auto mb-2 text-zinc-500" />
          <h2 className="text-sm font-medium text-zinc-200 mb-1">No clips yet</h2>
          <p className="text-xs text-zinc-500">
            Your exported and saved clips will appear here.
          </p>
        </div>
      </main>
    </div>
  )
}

export default History
