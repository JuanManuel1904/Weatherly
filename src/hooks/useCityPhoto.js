import { useState, useCallback, useRef } from 'react'

const photoCache = new Map()
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY

async function fetchCityPhoto(cityName, countryName) {
  const cacheKey = cityName.toLowerCase()
  if (photoCache.has(cacheKey)) return photoCache.get(cacheKey)

  const queries = [
    `${cityName} city skyline`,
    `${cityName} ${countryName} city`,
    `${cityName} cityscape`,
  ]

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: API_KEY } }
      )
      const data = await res.json()

      if (data.photos?.length) {
        const photo = data.photos[0]
        const result = {
          url: photo.src.large2x,
          credit: photo.photographer,
          creditUrl: photo.photographer_url,
        }
        photoCache.set(cacheKey, result)
        return result
      }
    } catch {
      // continúa con el siguiente query
    }
  }

  photoCache.set(cacheKey, null)
  return null
}

export function useCityPhoto() {
  const [photo, setPhoto] = useState(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const currentCity = useRef(null)

  const loadPhoto = useCallback(async (cityName, countryName) => {
    if (!cityName) return
    if (currentCity.current === cityName.toLowerCase()) return
    currentCity.current = cityName.toLowerCase()

    setPhotoLoading(true)
    setPhoto(null)

    const result = await fetchCityPhoto(cityName, countryName)
    setPhoto(result)
    setPhotoLoading(false)
  }, [])

  return { photo, photoLoading, loadPhoto }
}
