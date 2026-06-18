import { useState, useRef, useEffect } from 'react'

export default function SearchBar({ onSearch, suggestions, loadingSuggestions, onSuggest }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        onSuggest(query)
        setOpen(true)
      }, 300)
    } else {
      setOpen(false)
    }
    return () => clearTimeout(debounceRef.current)
  }, [query, onSuggest])

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setOpen(false)
    }
  }

  function handleSelect(city) {
    setQuery(`${city.name}, ${city.country}`)
    setOpen(false)
    onSearch(city)
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-strong rounded-2xl flex items-center gap-3 px-5 py-4 glow-border transition-all focus-within:border-cyan-glow/40">
          <svg className="w-5 h-5 text-cyan-glow shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Busca una ciudad…"
            className="flex-1 bg-transparent outline-none text-cyan-pale placeholder-slate-fog font-inter text-sm"
            onFocus={() => suggestions.length > 0 && setOpen(true)}
          />
          {loadingSuggestions && (
            <div className="w-4 h-4 border-2 border-cyan-glow/30 border-t-cyan-glow rounded-full animate-spin shrink-0" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setOpen(false) }}
              className="text-slate-fog hover:text-cyan-pale transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="bg-cyan-glow/20 hover:bg-cyan-glow/30 text-cyan-glow border border-cyan-glow/30 rounded-xl px-4 py-2 text-xs font-inter font-500 transition-all shrink-0"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-strong rounded-2xl overflow-hidden z-50 border border-cyan-glow/20 shadow-2xl">
          {suggestions.map((city, i) => (
            <button
              key={`${city.name}-${city.latitude}-${i}`}
              onClick={() => handleSelect(city)}
              className="w-full text-left px-5 py-3 hover:bg-cyan-glow/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
            >
              <svg className="w-4 h-4 text-slate-fog shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2"/>
                <circle cx="12" cy="9" r="2.5" strokeWidth="2"/>
              </svg>
              <div>
                <span className="text-cyan-pale text-sm font-inter">{city.name}</span>
                <span className="text-slate-fog text-xs ml-2">
                  {[city.admin1, city.country].filter(Boolean).join(', ')}
                </span>
              </div>
              <span className="ml-auto text-slate-fog text-xs">{city.country_code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
