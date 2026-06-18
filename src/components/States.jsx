export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-white/10 rounded-full mx-auto" />
        <div className="w-48 h-16 bg-white/10 rounded-2xl mx-auto" />
        <div className="w-32 h-4 bg-white/10 rounded mx-auto" />
      </div>
      {/* Sunrise bar */}
      <div className="glass rounded-2xl h-20" />
      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl h-24" />
        ))}
      </div>
      {/* Hourly */}
      <div className="glass rounded-2xl h-32" />
      {/* Daily */}
      <div className="glass rounded-2xl h-64" />
    </div>
  )
}

export function EmptyState({ onSearch }) {
  const suggestions = [
    { name: 'Bogotá', country: 'Colombia', latitude: 4.711, longitude: -74.0721, timezone: 'America/Bogota' },
    { name: 'Pereira', country: 'Colombia', latitude: 4.8087, longitude: -75.6906, timezone: 'America/Bogota' },
    { name: 'Madrid', country: 'España', latitude: 40.4165, longitude: -3.7026, timezone: 'Europe/Madrid' },
    { name: 'New York', country: 'Estados Unidos', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
    { name: 'Tokio', country: 'Japón', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
    { name: 'Londres', country: 'Reino Unido', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  ]

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      {/* Animated globe */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-glow/20 animate-pulse-slow" />
        <div className="absolute inset-4 rounded-full border border-cyan-glow/30 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-0 flex items-center justify-center text-5xl animate-float">🌍</div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="font-syne font-700 text-2xl text-cyan-pale">Explora el clima del mundo</h2>
        <p className="text-slate-fog font-inter text-sm max-w-xs">
          Busca cualquier ciudad para ver temperatura, viento, UV, amanecer y mucho más.
        </p>
      </div>

      {/* Quick city suggestions */}
      <div className="space-y-3 w-full max-w-sm">
        <p className="text-slate-fog text-xs text-center uppercase tracking-widest font-inter">Ciudades populares</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map(city => (
            <button
              key={city.name}
              onClick={() => onSearch(city)}
              className="glass hover:bg-cyan-glow/10 rounded-xl px-4 py-3 text-left transition-all border border-transparent hover:border-cyan-glow/30 group"
            >
              <div className="text-cyan-pale text-sm font-inter font-medium group-hover:text-cyan-glow transition-colors">{city.name}</div>
              <div className="text-slate-fog text-xs font-inter">{city.country}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
