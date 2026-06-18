import { useState, useCallback } from 'react'

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

const WMO_CODES = {
  0: { label: 'Despejado', icon: '☀️', bg: 'day' },
  1: { label: 'Mayormente despejado', icon: '🌤️', bg: 'day' },
  2: { label: 'Parcialmente nublado', icon: '⛅', bg: 'day' },
  3: { label: 'Cubierto', icon: '☁️', bg: 'cloudy' },
  45: { label: 'Niebla', icon: '🌫️', bg: 'cloudy' },
  48: { label: 'Niebla con escarcha', icon: '🌫️', bg: 'cloudy' },
  51: { label: 'Llovizna ligera', icon: '🌦️', bg: 'rain' },
  53: { label: 'Llovizna moderada', icon: '🌦️', bg: 'rain' },
  55: { label: 'Llovizna intensa', icon: '🌧️', bg: 'rain' },
  61: { label: 'Lluvia ligera', icon: '🌧️', bg: 'rain' },
  63: { label: 'Lluvia moderada', icon: '🌧️', bg: 'rain' },
  65: { label: 'Lluvia intensa', icon: '🌧️', bg: 'rain' },
  71: { label: 'Nieve ligera', icon: '🌨️', bg: 'snow' },
  73: { label: 'Nieve moderada', icon: '❄️', bg: 'snow' },
  75: { label: 'Nieve intensa', icon: '❄️', bg: 'snow' },
  80: { label: 'Chubascos ligeros', icon: '🌦️', bg: 'rain' },
  81: { label: 'Chubascos moderados', icon: '🌧️', bg: 'rain' },
  82: { label: 'Chubascos intensos', icon: '⛈️', bg: 'storm' },
  95: { label: 'Tormenta', icon: '⛈️', bg: 'storm' },
  96: { label: 'Tormenta con granizo', icon: '⛈️', bg: 'storm' },
  99: { label: 'Tormenta fuerte con granizo', icon: '⛈️', bg: 'storm' },
}

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const searchCities = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    setLoadingSuggestions(true)
    try {
      const res = await fetch(`${GEO_API}?name=${encodeURIComponent(query)}&count=6&language=es&format=json`)
      const data = await res.json()
      setSuggestions(data.results || [])
    } catch {
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }, [])

  const fetchWeather = useCallback(async (city) => {
    setLoading(true)
    setError(null)
    setSuggestions([])
    try {
      // 1. Geocode
      let lat, lon, name, country, timezone
      if (city.latitude) {
        lat = city.latitude
        lon = city.longitude
        name = city.name
        country = city.country
        timezone = city.timezone
      } else {
        const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=es&format=json`)
        const geoData = await geoRes.json()
        if (!geoData.results?.length) throw new Error('Ciudad no encontrada')
        const loc = geoData.results[0]
        lat = loc.latitude
        lon = loc.longitude
        name = loc.name
        country = loc.country
        timezone = loc.timezone
      }

      // 2. Weather
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        timezone: timezone || 'auto',
        current: [
          'temperature_2m',
          'apparent_temperature',
          'relative_humidity_2m',
          'precipitation',
          'weather_code',
          'wind_speed_10m',
          'wind_direction_10m',
          'surface_pressure',
          'visibility',
          'uv_index',
          'is_day',
        ].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'weather_code',
          'sunrise',
          'sunset',
          'precipitation_sum',
          'wind_speed_10m_max',
          'uv_index_max',
        ].join(','),
        hourly: ['temperature_2m', 'precipitation_probability', 'weather_code'].join(','),
        forecast_days: 7,
      })

      const wRes = await fetch(`${WEATHER_API}?${params}`)
      const wData = await wRes.json()

      const cur = wData.current
      const code = cur.weather_code
      const wmoInfo = WMO_CODES[code] || { label: 'Desconocido', icon: '🌡️', bg: 'day' }
      const isDay = cur.is_day === 1

      // Wind direction to compass
      const windDeg = cur.wind_direction_10m
      const dirs = ['N','NE','E','SE','S','SO','O','NO']
      const windDir = dirs[Math.round(windDeg / 45) % 8]

      // Today's hourly (next 24h)
      const nowHour = new Date().getHours()
      const hourlySlice = wData.hourly.time
        .map((t, i) => ({
          time: t,
          temp: wData.hourly.temperature_2m[i],
          precipProb: wData.hourly.precipitation_probability[i],
          code: wData.hourly.weather_code[i],
        }))
        .filter(h => {
          const d = new Date(h.time)
          return d >= new Date()
        })
        .slice(0, 24)

      setWeather({
        city: name,
        country,
        lat,
        lon,
        isDay,
        condition: wmoInfo,
        current: {
          temp: Math.round(cur.temperature_2m),
          feelsLike: Math.round(cur.apparent_temperature),
          humidity: cur.relative_humidity_2m,
          precipitation: cur.precipitation,
          windSpeed: Math.round(cur.wind_speed_10m),
          windDir,
          windDeg,
          pressure: Math.round(cur.surface_pressure),
          visibility: (cur.visibility / 1000).toFixed(1),
          uvIndex: Math.round(cur.uv_index),
        },
        daily: wData.daily.time.map((t, i) => ({
          date: t,
          maxTemp: Math.round(wData.daily.temperature_2m_max[i]),
          minTemp: Math.round(wData.daily.temperature_2m_min[i]),
          code: wData.daily.weather_code[i],
          condition: WMO_CODES[wData.daily.weather_code[i]] || { icon: '🌡️', label: 'Desconocido' },
          sunrise: wData.daily.sunrise[i],
          sunset: wData.daily.sunset[i],
          precipitation: wData.daily.precipitation_sum[i],
          windMax: Math.round(wData.daily.wind_speed_10m_max[i]),
          uvMax: wData.daily.uv_index_max[i],
        })),
        hourly: hourlySlice,
        timezone,
        updatedAt: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { weather, loading, error, suggestions, loadingSuggestions, searchCities, fetchWeather }
}
