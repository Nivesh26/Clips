import Hero from '../Components/Hero'
import { FiUploadCloud } from 'react-icons/fi'

const Local = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Hero />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-full border border-dashed border-zinc-800 rounded-xl p-10 bg-zinc-900/20">
          <FiUploadCloud className="w-8 h-8 mx-auto mb-3 text-zinc-400" />
          <h2 className="text-sm font-medium text-zinc-200 mb-1">Upload a video to start</h2>
          <p className="text-xs text-zinc-500 mb-6">MP4, MOV, or WEBM up to 500MB</p>
          <label className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-zinc-100 text-zinc-950 hover:bg-white cursor-pointer transition-colors">
            Select Video File
            <input type="file" accept="video/*" className="hidden" />
          </label>
        </div>
      </main>
    </div>
  )
}

export default Local
