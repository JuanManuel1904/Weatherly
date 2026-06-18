import { useState, useEffect } from 'react'
import { useWeather } from './hooks/useWeather'
import SearchBar from './components/SearchBar'
import WeatherMain from './components/WeatherMain'
import { HourlyForecast, DailyForecast } from './components/Forecast'
import { LoadingSkeleton, EmptyState } from './components/States'
import { formatDay } from './utils/helpers'

const BG_THEMES = {
  day: 'from-[#0B1F3A] via-[#1E3A5F] to-[#2B5090]',
  night: 'from-[#060D1A] via-[#0B1426] to-[#111D35]',
  rain: 'from-[#0A1520] via-[#1A2D44] to-[#0E2038]',
  cloudy: 'from-[#0F1C2E] via-[#1E3050] to-[#16253D]',
  storm: 'from-[#070C14] via-[#1A1535] to-[#0E1525]',
  snow: 'from-[#0D1B2A] via-[#1B3050] to-[#162840]',
}

function getThemeKey(weather) {
  if (!weather) return 'day'
  if (!weather.isDay) return 'night'
  return weather.condition?.bg || 'day'
}

export default function App() {
  const { weather, loading, error, suggestions, loadingSuggestions, searchCities, fetchWeather } = useWeather()
  const [theme, setTheme] = useState('day')

  useEffect(() => {
    if (weather) setTheme(getThemeKey(weather))
  }, [weather])

  // Load default city on mount
  useEffect(() => {
    fetchWeather({ name: 'Bogotá', country: 'Colombia', latitude: 4.711, longitude: -74.0721, timezone: 'America/Bogota' })
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br ${BG_THEMES[theme]} transition-all duration-1000`}>
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        {theme === 'night' && (
          <>
            <div className="absolute top-20 right-20 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" />
            <div className="absolute bottom-40 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-glow/20 border border-cyan-glow/30 flex items-center justify-center text-sm">
              🌐
            </div>
            <span className="font-syne font-700 text-cyan-pale text-lg tracking-tight">Weatherly</span>
          </div>
          {weather && (
            <div className="text-right">
              <div className="text-cyan-pale font-syne font-600 text-sm">{weather.city}</div>
              <div className="text-slate-fog font-inter text-xs">{weather.country} · {weather.updatedAt}</div>
            </div>
          )}
        </div>

        {/* Search */}
        <SearchBar
          onSearch={fetchWeather}
          suggestions={suggestions}
          loadingSuggestions={loadingSuggestions}
          onSuggest={searchCities}
        />

        {/* Today's date when we have data */}
        {weather && !loading && (
          <div className="text-center text-slate-fog text-xs font-inter capitalize">
            {formatDay(weather.daily[0].date)}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="glass-strong rounded-2xl p-8 text-center space-y-3">
            <div className="text-4xl">⚠️</div>
            <div className="text-cyan-pale font-inter font-medium">No se pudo obtener el clima</div>
            <div className="text-slate-fog font-inter text-sm">{error}</div>
            <button
              onClick={() => fetchWeather('Bogotá')}
              className="mt-2 text-cyan-glow text-sm font-inter hover:underline"
            >
              Ver Bogotá
            </button>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <WeatherMain weather={weather} />
            <HourlyForecast hourly={weather.hourly} />
            <DailyForecast daily={weather.daily} />
          </div>
        ) : (
          <EmptyState onSearch={fetchWeather} />
        )}

        {/* Footer */}
        <div className="text-center pt-4 pb-2">
          <p className="text-slate-fog text-xs font-inter">
            Datos por{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-cyan-glow/70 hover:text-cyan-glow transition-colors">
              Open-Meteo
            </a>
            {' '}· Gratis y sin API key 🙌
          </p>
        </div>
      </div>
    </div>
  )
}
