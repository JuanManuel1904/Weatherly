import { formatDay, isToday } from '../utils/helpers'

function formatHour(isoStr) {
  const d = new Date(isoStr)
  const h = d.getHours()
  if (h === 0) return '12\nAM'
  if (h === 12) return '12\nPM'
  return h < 12 ? `${h}\nAM` : `${h - 12}\nPM`
}

export function HourlyForecast({ hourly }) {
  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <h3 className="text-slate-fog text-xs uppercase tracking-widest font-inter">Pronóstico por hora</h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {hourly.map((h, i) => {
          const label = formatHour(h.time)
          const [num, period] = label.split('\n')
          return (
            <div
              key={h.time}
              className={`flex flex-col items-center gap-2 shrink-0 rounded-xl px-3 py-3 transition-all ${
                i === 0 ? 'bg-cyan-glow/15 border border-cyan-glow/30' : 'hover:bg-white/5'
              }`}
            >
              <div className="text-slate-fog text-center leading-none">
                <span className="text-sm font-inter font-medium text-cyan-pale block">{num}</span>
                <span className="text-[10px] font-inter text-cyan-pale/60">{period}</span>
              </div>
              <div className="text-xl">{/* WMO icon */}
                {h.code <= 1 ? '☀️' : h.code <= 3 ? '⛅' : h.code <= 55 ? '🌦️' : h.code <= 65 ? '🌧️' : h.code <= 75 ? '❄️' : '⛈️'}
              </div>
              <div className="text-cyan-pale text-sm font-inter font-semibold">{Math.round(h.temp)}°</div>
              {h.precipProb > 0 && (
                <div className="text-blue-300 text-[10px] font-inter">{h.precipProb}%</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DailyForecast({ daily }) {
  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <h3 className="text-slate-fog text-xs uppercase tracking-widest font-inter">Próximos 7 días</h3>
      <div className="space-y-1">
        {daily.map((day, i) => {
          const today = isToday(day.date)
          return (
            <div
              key={day.date}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                today ? 'bg-cyan-glow/10 border border-cyan-glow/20' : 'hover:bg-white/5'
              }`}
            >
              {/* Day */}
              <div className="w-14 text-xs font-inter text-cyan-pale/70 capitalize">
                {today ? <span className="text-cyan-glow font-semibold">Hoy</span> : formatDay(day.date, true)}
              </div>
              {/* Icon */}
              <span className="text-xl w-8 text-center">{day.condition.icon}</span>
              {/* Precip bar */}
              <div className="flex-1 hidden sm:block">
                <div className="h-1 bg-navy-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-glow rounded-full transition-all"
                    style={{ width: `${Math.min(day.precipitation * 10, 100)}%` }}
                  />
                </div>
              </div>
              {/* Condition label */}
              <div className="hidden md:block text-cyan-pale/70 text-xs font-inter flex-1 truncate">{day.condition.label}</div>
              {/* Temps */}
              <div className="flex items-center gap-3 ml-auto text-sm font-inter">
                <span className="text-cyan-pale/70">{day.minTemp}°</span>
                {/* Temp range bar */}
                <div className="w-16 h-1.5 bg-navy-600 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-gradient-to-r from-blue-400 via-cyan-glow to-orange-300 rounded-full opacity-80" />
                </div>
                <span className="text-cyan-pale font-medium">{day.maxTemp}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
