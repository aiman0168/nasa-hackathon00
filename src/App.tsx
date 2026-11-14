import { Activity, AlertTriangle, CheckCircle2, ExternalLink, HeartPulse, MoonStar, Shield, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { computeReadiness } from './lib/alerts'
import { getDemoSeed } from './lib/demoData'
import { readActiveCrewId, readCrew, writeActiveCrewId, writeCrew } from './lib/storage'
import type { CrewMember } from './types'

const defaultCrew = getDemoSeed()

function App() {
  const [crew, setCrew] = useState<CrewMember[]>(() => {
    const stored = readCrew()
    if (stored.length) return stored
    writeCrew(defaultCrew)
    return defaultCrew
  })

  const [activeId, setActiveId] = useState<string>(() => {
    const stored = readActiveCrewId()
    return stored ?? crew[0]?.id ?? ''
  })

  const activeCrew = crew.find((member) => member.id === activeId) ?? crew[0]
  const readiness = useMemo(() => (activeCrew ? computeReadiness(activeCrew) : null), [activeCrew])

  const handleSelectCrew = (id: string) => {
    setActiveId(id)
    writeActiveCrewId(id)
  }

  const loadDemo = () => {
    const demo = getDemoSeed()
    setCrew(demo)
    setActiveId(demo[0].id)
    writeCrew(demo)
    writeActiveCrewId(demo[0].id)
  }

  const chartData = useMemo(() => {
    return (activeCrew?.entries ?? []).slice(-14).map((entry) => ({
      date: entry.date.slice(5),
      sleep: entry.sleepHours,
      mood: entry.mood,
      stress: entry.stress,
      heart: entry.heartRate,
    }))
  }, [activeCrew])

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10">
                <HeartPulse className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <div className="text-xl font-black tracking-[0.22em] text-cyan-200">V.I.O</div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Vitals in Orbit</div>
              </div>
            </div>
            <nav className="flex items-center gap-2 text-sm">
              <NavLink className="rounded-full px-3 py-2 text-slate-300 hover:bg-slate-800" to="/">Overview</NavLink>
              <NavLink className="rounded-full px-3 py-2 text-slate-300 hover:bg-slate-800" to="/checkin">Daily Check-in</NavLink>
              <NavLink className="rounded-full px-3 py-2 text-slate-300 hover:bg-slate-800" to="/body-map">Body Map</NavLink>
              <NavLink className="rounded-full px-3 py-2 text-slate-300 hover:bg-slate-800" to="/report">Flight Surgeon</NavLink>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6">
          <section className="mb-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  <Shield className="h-4 w-4" />
                  Human Exploration Support
                </p>
                <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Vitals in Orbit</h1>
                <p className="mt-2 max-w-2xl text-slate-300">Know your baseline. Catch the drift. Act early.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {crew.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSelectCrew(member.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${activeCrew?.id === member.id ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-slate-700 bg-slate-900 text-slate-200'}`}
                  >
                    <div className="text-sm font-semibold">{member.name}</div>
                    <div className="text-xs text-slate-400">Mission Day {member.missionDay}</div>
                  </button>
                ))}
                <button type="button" className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200" onClick={loadDemo}>Load demo data</button>
              </div>
            </div>
          </section>

          <Routes>
            <Route path="/" element={<Overview crew={crew} activeCrew={activeCrew} readiness={readiness} chartData={chartData} />} />
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/body-map" element={<BodyMapPage />} />
            <Route path="/report" element={<ReportPage activeCrew={activeCrew} readiness={readiness} />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}

function Overview({ crew, activeCrew, readiness, chartData }: { crew: CrewMember[]; activeCrew?: CrewMember; readiness: any; chartData: any[] }) {
  const healthScore = readiness?.score ?? 0
  const overallTone = readiness?.overall === 'GREEN' ? 'text-emerald-300' : readiness?.overall === 'YELLOW' ? 'text-amber-300' : 'text-rose-300'

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Readiness', value: `${healthScore}/100`, icon: Activity, tone: 'emerald' },
          { label: 'Alerts', value: `${readiness?.alerts.length ?? 0}`, icon: AlertTriangle, tone: 'amber' },
          { label: 'Crew', value: `${crew.length}`, icon: Shield, tone: 'cyan' },
          { label: 'Streak', value: `${activeCrew?.streak ?? 0} days`, icon: TrendingUp, tone: 'violet' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-slate-950/20">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">{label}</span>
              <Icon className={`h-5 w-5 text-${tone}-300`} />
            </div>
            <div className="text-3xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Readiness trend</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{activeCrew?.name ?? 'Crew member'}</h2>
            </div>
            <div className={`rounded-full border px-3 py-1 text-sm font-semibold ${overallTone} border-current bg-slate-800/80`}>
              {readiness?.overall ?? 'GREEN'}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="sleep" stroke="#22d3ee" fill="url(#colorSleep)" />
                <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="mood" stroke="#a78bfa" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Mission hazard exposure</p>
          <div className="mt-5 space-y-4">
            {[
              'Space radiation',
              'Isolation and confinement',
              'Distance from Earth',
              'Altered gravity',
              'Hostile closed environments',
            ].map((hazard, index) => (
              <div key={hazard}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                  <span>{hazard}</span>
                  <span className="text-slate-400">{['LOW', 'MED', 'HIGH'][index % 3]}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500" style={{ width: `${30 + index * 18}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">NASA Human Research Program</p>
          <h2 className="mt-2 text-2xl font-bold text-white">NASA Data &amp; Resources</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: '5 Hazards of Human Spaceflight',
              description: 'Basic information on the main hazards that affect humans on space missions, with links to detailed NASA articles and reports.',
              href: 'https://www.nasa.gov/hrp/hazards/',
            },
            {
              title: 'Risks of Human Spaceflight',
              description: 'An overview of the main risks faced by humans on space missions, with links to detailed NASA articles and reports.',
              href: 'https://www.nasa.gov/hrp/risks/',
            },
            {
              title: 'Ongoing HRP Research in Space',
              description: 'Articles about ongoing research from NASA’s Human Research Program.',
              href: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
            },
          ].map(({ title, description, href }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-cyan-500/60 hover:bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-cyan-200 group-hover:text-cyan-100">{title}</h3>
                <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" />
              </div>
              <p className="mt-3 text-sm text-slate-300">{description}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Recent alerts</p>
          <div className="space-y-3">
            {(readiness?.alerts.length ? readiness.alerts : [{ title: 'No alerts', message: 'Baseline looks stable. Keep tracking daily.', level: 'GREEN' }]).map((alert: { title: string; message: string; level: 'GREEN' | 'YELLOW' | 'RED' }) => (
              <div key={alert.title} className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-3">
                <div className={`mt-1 rounded-full p-1 ${alert.level === 'RED' ? 'bg-rose-500/20 text-rose-300' : alert.level === 'YELLOW' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {alert.level === 'RED' ? <AlertTriangle className="h-4 w-4" /> : alert.level === 'YELLOW' ? <MoonStar className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div>
                  <div className="font-semibold text-white">{alert.title}</div>
                  <div className="text-sm text-slate-300">{alert.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Mission routine</p>
          <ul className="space-y-3 text-sm text-slate-200">
            {[
              'Morning vitals check – due in 40 min',
              'Evening mood & sleep log – overdue by 2 hours',
              'Weekly strength plan – due Friday',
              'Hydration reminder – due now',
            ].map((task) => (
              <li key={task} className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {task}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function CheckinPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold text-white">Daily check-in</h2>
      <p className="mt-2 text-slate-300">This guided form helps you compare today’s health data to your personal baseline and catch drift early.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ['Heart rate', 'Resting bpm. A steady rise may signal heat stress, dehydration, or recovery issues.'],
          ['Blood pressure', 'Measure after rest. Systolic and diastolic trends matter.'],
          ['Body temperature', 'A small increase may suggest stress or infection; use the same method each time.'],
          ['Blood glucose', 'Useful for energy and nutrition patterns in space missions.'],
          ['SpO2', 'Check oxygen saturation to confirm respiratory stability.'],
          ['Sleep', 'Track total hours and quality to watch for fatigue and mood drift.'],
        ].map(([label, help]) => (
          <div key={label} className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
            <div className="font-semibold text-white">{label}</div>
            <div className="mt-2 text-sm text-slate-300">{help}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BodyMapPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold text-white">Body map</h2>
      <div className="mt-6 flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-950/70 p-8">
        <svg viewBox="0 0 300 420" className="h-[420px] w-[300px]" aria-label="Human body map">
          <circle cx="150" cy="55" r="30" fill="#4ade80" opacity="0.9" />
          <rect x="130" y="90" width="40" height="80" rx="18" fill="#fbbf24" opacity="0.9" />
          <rect x="100" y="120" width="25" height="100" rx="12" fill="#60a5fa" opacity="0.9" />
          <rect x="175" y="120" width="25" height="100" rx="12" fill="#60a5fa" opacity="0.9" />
          <rect x="110" y="210" width="30" height="120" rx="12" fill="#e879f9" opacity="0.9" />
          <rect x="160" y="210" width="30" height="120" rx="12" fill="#e879f9" opacity="0.9" />
          <rect x="130" y="180" width="40" height="70" rx="14" fill="#f87171" opacity="0.9" />
          <circle cx="110" cy="58" r="12" fill="#fca5a5" opacity="0.9" />
          <circle cx="190" cy="58" r="12" fill="#fca5a5" opacity="0.9" />
          <path d="M120 250 Q150 280 180 250" fill="none" stroke="#f4f4f5" strokeWidth="3" opacity="0.8" />
        </svg>
      </div>
    </div>
  )
}

function ReportPage({ activeCrew, readiness }: { activeCrew?: CrewMember; readiness: any }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Ground link summary</p>
          <h2 className="mt-2 text-3xl font-black text-white">V.I.O Health Report</h2>
        </div>
        <button type="button" className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">Print</button>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <p className="text-lg font-semibold text-white">Astronaut: {activeCrew?.name ?? 'Crew member'}</p>
        <p className="mt-2 text-slate-300">Readiness score: {readiness?.score ?? 0}/100</p>
        <p className="mt-6 text-slate-200">{readiness?.narrative ?? 'No report generated.'}</p>
      </div>
    </div>
  )
}

export default App
