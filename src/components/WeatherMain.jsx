import { formatTime, uvLabel, windLabel } from '../utils/helpers'

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-fog text-xs font-inter uppercase tracking-wider">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-cyan-pale font-inter font-semibold text-xl leading-none">{value}</div>
      {sub && <div className="text-slate-fog text-xs font-inter">{sub}</div>}
    </div>
  )
}

function WindCompass({ deg, speed, dir }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-slate-fog text-xs font-inter uppercase tracking-wider">
        <span>🧭</span>
        <span>Viento</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-cyan-pale font-inter font-semibold text-xl leading-none">{speed} km/h</div>
          <div className="text-slate-fog text-xs mt-1">{windLabel(speed)}</div>
        </div>
        {/* Mini compass */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border border-cyan-glow/20 bg-navy-900/60" />
          {/* Cardinal points */}
          {[['N',0],['E',90],['S',180],['O',270]].map(([l, d]) => (
            <span
              key={l}
              className="absolute text-[8px] text-slate-fog font-inter"
              style={{
                top: d === 0 ? '1px' : d === 180 ? 'auto' : '50%',
                bottom: d === 180 ? '1px' : 'auto',
                left: d === 270 ? '1px' : d === 90 ? 'auto' : '50%',
                right: d === 90 ? '1px' : 'auto',
                transform: d === 0 || d === 180 ? 'translateX(-50%)' : 'translateY(-50%)',
              }}
            >{l}</span>
          ))}
          {/* Arrow */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className="w-0.5 h-5 bg-gradient-to-t from-transparent to-cyan-glow rounded-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cyan-glow text-[9px] font-inter font-semibold">{dir}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WeatherMain({ weather }) {
  const { current, condition, isDay, city, country, daily } = weather
  const today = daily[0]
  const uv = uvLabel(current.uvIndex)

  return (
    <div className="space-y-6">
      {/* Hero temp block */}
      <div className="text-center space-y-2 py-4">
        <div className="text-7xl animate-float select-none">{condition.icon}</div>
        <div className="font-syne font-800 leading-none glow-text" style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', color: '#00D4FF' }}>
          {current.temp}°
        </div>
        <div className="text-cyan-soft font-inter text-lg font-light">{condition.label}</div>
        <div className="text-slate-fog font-inter text-sm">
          Sensación térmica <span className="text-cyan-pale font-medium">{current.feelsLike}°C</span>
        </div>
        <div className="text-slate-fog font-inter text-xs">
          Máx {today.maxTemp}° · Mín {today.minTemp}°
        </div>
      </div>

      {/* Sunrise / Sunset highlight */}
      <div className="glass-strong rounded-2xl p-5 flex items-center justify-around">
        <div className="text-center space-y-1">
          <div className="text-2xl">🌅</div>
          <div className="text-slate-fog text-xs uppercase tracking-wider font-inter">Amanecer</div>
          <div className="text-cyan-pale font-inter font-semibold text-lg">{formatTime(today.sunrise)}</div>
        </div>
        {/* Timeline */}
        <div className="flex-1 mx-6 relative">
          <div className="h-px bg-gradient-to-r from-orange-400/50 via-cyan-glow/60 to-indigo-400/50" />
          {/* Sun position indicator */}
          {(() => {
            const now = new Date()
            const rise = new Date(today.sunrise)
            const set = new Date(today.sunset)
            const total = set - rise
            const elapsed = Math.max(0, Math.min(now - rise, total))
            const pct = total > 0 ? (elapsed / total) * 100 : 50
            return (
              <div
                className="absolute -top-2 w-4 h-4 rounded-full bg-yellow-300 shadow-lg"
                style={{ left: `${pct}%`, transform: 'translateX(-50%)', boxShadow: '0 0 12px rgba(253,224,71,0.8)' }}
              />
            )
          })()}
        </div>
        <div className="text-center space-y-1">
          <div className="text-2xl">🌇</div>
          <div className="text-slate-fog text-xs uppercase tracking-wider font-inter">Atardecer</div>
          <div className="text-cyan-pale font-inter font-semibold text-lg">{formatTime(today.sunset)}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="💧" label="Humedad" value={`${current.humidity}%`} sub={current.humidity > 70 ? 'Ambiente húmedo' : current.humidity < 30 ? 'Ambiente seco' : 'Confort normal'} />
        <StatCard icon="🌡️" label="Presión" value={`${current.pressure}`} sub="hPa" />
        <StatCard icon="👁️" label="Visibilidad" value={`${current.visibility} km`} sub={current.visibility > 10 ? 'Excelente' : current.visibility > 5 ? 'Buena' : 'Reducida'} />
        <div className="glass rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-fog text-xs font-inter uppercase tracking-wider">
            <span>☀️</span>
            <span>Índice UV</span>
          </div>
          <div className={`font-inter font-semibold text-xl leading-none ${uv.color}`}>{current.uvIndex}</div>
          <div className={`text-xs font-inter ${uv.color}`}>{uv.label}</div>
        </div>
        <StatCard icon="🌧️" label="Precipitación" value={`${current.precipitation} mm`} sub="últimas horas" />
        <WindCompass deg={current.windDeg} speed={current.windSpeed} dir={current.windDir} />
      </div>
    </div>
  )
}
