# 🌐 Weatherly - Weather App
*A sleek real-time weather application built with React, JavaScript, and Tailwind CSS.*

---

## ✨ Features

### 🔍 **City Search**
- **Autocomplete search** with debounce for any city in the world.
- Quick access to **popular cities** on the empty state screen.
- Results powered by **Open-Meteo Geocoding API** (no API key needed).

### 🌡️ **Current Weather**
- **Temperature** and **feels like** with min/max of the day.
- **Sunrise & sunset** times with an animated real-time sun position indicator.
- **Humidity**, **atmospheric pressure**, and **visibility**.
- **Wind speed and direction** with an interactive mini compass.
- **UV index** with risk classification (Low → Extreme).
- **Precipitation** in mm.

### 📅 **Forecasts**
- **Hourly forecast** for the next 24 hours with precipitation probability.
- **7-day forecast** with temperature range bars and weather icons.

### 🎨 **Dynamic Design**
- **City photo background** pulled from Pexels for every searched city.
- Smooth **fade-in transition** when the photo loads.
- **Overlay adapts** by condition: darker at night, stormier in storms.
- Glassmorphism cards with `backdrop-filter` for a modern look.
- Fallback gradient if no photo is available.

---

## 🛠️ Technologies

- **React 19** (Hooks, custom hooks, state management)
- **JavaScript ES6+**
- **Tailwind CSS 3** (glassmorphism, custom design tokens)
- **Vite 6** (build tool)
- **Open-Meteo API** (weather data — free, no API key)
- **Open-Meteo Geocoding API** (city search — free, no API key)
- **Pexels API** (city background photos — free tier)

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/weatherly.git
cd weatherly
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

Create a `.env` file in the root:

```env
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

Get a free key at [pexels.com/api](https://www.pexels.com/api/) — takes 2 minutes.

---

## 🌍 Deploy on Vercel

1. Push the repo to GitHub.
2. Import it at [vercel.com](https://vercel.com) → New Project.
3. Add the environment variable `VITE_PEXELS_API_KEY` in Settings → Environment Variables.
4. Click **Deploy** ✅

Vercel auto-detects Vite — no extra configuration needed.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx     # Autocomplete city search
│   ├── WeatherMain.jsx   # Temperature, stats, sunrise/sunset
│   ├── Forecast.jsx      # Hourly and 7-day forecast
│   └── States.jsx        # Loading skeleton and empty state
├── hooks/
│   ├── useWeather.js     # Weather & geocoding API logic
│   └── useCityPhoto.js   # Pexels photo fetching with cache
├── utils/
│   └── helpers.js        # Format and utility functions
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🔮 Future Improvements

- `localStorage` persistence for recent searches.
- Toggle between °C and °F.
- Weather alerts and notifications.
- Geolocation to auto-detect current city.
- PWA support for offline use.

---

![Preview](https://via.placeholder.com/800x400?text=Weatherly+Preview) *← Replace with actual screenshot*
