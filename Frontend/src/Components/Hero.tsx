import { NavLink } from 'react-router'
import { FiHardDrive, FiScissors, FiYoutube, FiClock } from 'react-icons/fi'

interface TabItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

const tabs: TabItem[] = [
  { to: '/', label: 'Local', icon: FiHardDrive, exact: true },
  { to: '/youtube', label: 'YouTube', icon: FiYoutube },
  { to: '/aiclips', label: 'AI Clips', icon: FiScissors },
  { to: '/history', label: 'History', icon: FiClock },
]

const Hero = () => {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-100 mb-1">
          Clipping Studio
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          Create and manage your video clips.
        </p>

        <nav aria-label="Sections" className="inline-flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.exact}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Hero
