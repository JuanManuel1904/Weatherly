export function formatTime(isoString) {
  if (!isoString) return '--:--'
  const d = new Date(isoString)
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

export function formatDay(dateStr, short = false) {
  const d = new Date(dateStr + 'T12:00:00')
  if (short) return d.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', '')
  return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function isToday(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

export function uvLabel(uv) {
  if (uv <= 2) return { label: 'Bajo', color: 'text-green-400' }
  if (uv <= 5) return { label: 'Moderado', color: 'text-yellow-400' }
  if (uv <= 7) return { label: 'Alto', color: 'text-orange-400' }
  if (uv <= 10) return { label: 'Muy alto', color: 'text-red-400' }
  return { label: 'Extremo', color: 'text-purple-400' }
}

export function windLabel(speed) {
  if (speed < 10) return 'Calma'
  if (speed < 30) return 'Brisa leve'
  if (speed < 50) return 'Brisa moderada'
  if (speed < 75) return 'Viento fuerte'
  return 'Tormenta'
}

export function getBgTheme(condition, isDay) {
  if (!isDay) return 'night'
  const bg = condition?.bg || 'day'
  return bg
}
