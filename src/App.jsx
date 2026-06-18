import { useState, useEffect } from 'react'
import { useWeather } from './hooks/useWeather'
import { useCityPhoto } from './hooks/useCityPhoto'
import SearchBar from './components/SearchBar'
import WeatherMain from './components/WeatherMain'
import { HourlyForecast, DailyForecast } from './components/Forecast'
import { LoadingSkeleton, EmptyState } from './components/States'
import { formatDay } from './utils/helpers'

const OVERLAY_THEMES = {
  day:    'bg-navy-900/50',
  night:  'bg-navy-900/75',
  rain:   'bg-navy-900/65',
  cloudy: 'bg-navy-900/60',
  storm:  'bg-navy-900/80',
  snow:   'bg-navy-900/60',
}

const FALLBACK_THEMES = {
  day:    'from-[#0B1F3A] via-[#1E3A5F] to-[#2B5090]',
  night:  'from-[#060D1A] via-[#0B1426] to-[#111D35]',
  rain:   'from-[#0A1520] via-[#1A2D44] to-[#0E2038]',
  cloudy: 'from-[#0F1C2E] via-[#1E3050] to-[#16253D]',
  storm:  'from-[#070C14] via-[#1A1535] to-[#0E1525]',
  snow:   'from-[#0D1B2A] via-[#1B3050] to-[#162840]',
}

function getThemeKey(weather) {
  if (!weather) return 'day'
  if (!weather.isDay) return 'night'
  return weather.condition?.bg || 'day'
}

export default function App() {
  const { weather, loading, error, suggestions, loadingSuggestions, searchCities, fetchWeather } = useWeather()
  const { photo, photoLoading, loadPhoto } = useCityPhoto()
  const [theme, setTheme] = useState('day')
  const [bgVisible, setBgVisible] = useState(false)

  useEffect(() => {
    if (weather) {
      setTheme(getThemeKey(weather))
      loadPhoto(weather.city, weather.country)
    }
  }, [weather, loadPhoto])

  useEffect(() => {
    if (photo?.url) {
      setBgVisible(false)
      const t = setTimeout(() => setBgVisible(true), 50)
      return () => clearTimeout(t)
    }
  }, [photo?.url])

  useEffect(() => {
    fetchWeather({ name: 'Bogotá', country: 'Colombia', latitude: 4.711, longitude: -74.0721, timezone: 'America/Bogota' })
  }, [])

  const overlayClass = OVERLAY_THEMES[theme] || OVERLAY_THEMES.day
  const fallbackGradient = FALLBACK_THEMES[theme] || FALLBACK_THEMES.day

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* Capa 1: gradiente fallback */}
      <div className={`fixed inset-0 bg-gradient-to-br ${fallbackGradient} transition-all duration-1000`} />

      {/* Capa 2: foto de la ciudad */}
      {photo?.url && (
        <div
          className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${photo.url})`, opacity: bgVisible ? 1 : 0 }}
        />
      )}

      {/* Capa 3: overlay oscuro según condición */}
      <div className={`fixed inset-0 ${overlayClass} transition-all duration-1000`} />

      {/* Capa 4: degradado inferior para legibilidad */}
      <div className="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-navy-900/60 to-transparent pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-6">

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

        <SearchBar
          onSearch={fetchWeather}
          suggestions={suggestions}
          loadingSuggestions={loadingSuggestions}
          onSuggest={searchCities}
        />

        {weather && !loading && (
          <div className="text-center text-slate-fog text-xs font-inter capitalize">
            {formatDay(weather.daily[0].date)}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="glass-strong rounded-2xl p-8 text-center space-y-3">
            <div className="text-4xl">⚠️</div>
            <div className="text-cyan-pale font-inter font-medium">No se pudo obtener el clima</div>
            <div className="text-slate-fog font-inter text-sm">{error}</div>
            <button onClick={() => fetchWeather('Bogotá')} className="mt-2 text-cyan-glow text-sm font-inter hover:underline">
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

        <div className="text-center pt-4 pb-2 space-y-1">
          <p className="text-slate-fog text-xs font-inter">
            Datos por{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-cyan-glow/70 hover:text-cyan-glow transition-colors">
              Open-Meteo
            </a>
            {' '}· Gratis y sin API key 🙌
          </p>
          {photo?.url && (
            <p className="text-slate-fog/50 text-xs font-inter">
              📷 Foto:{' '}
              <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-fog transition-colors">
                Wikimedia Commons
              </a>
            </p>
          )}
          {photoLoading && (
            <p className="text-slate-fog/40 text-xs font-inter animate-pulse">Buscando foto de la ciudad…</p>
          )}
        </div>
      </div>
    </div>
  )
}
