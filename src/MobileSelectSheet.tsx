import { useEffect, useId, useRef, useState } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"
import "./mobile-category-picker.css"

export default function MobileSelectSheet({ value, onChange, options, title, searchable = false, searchLabel = "Search options", triggerId }: {
  value: string
  onChange: (id: string) => void
  options: { id: string; label: string }[]
  title: string
  searchable?: boolean
  searchLabel?: string
  triggerId?: string
}) {
  const headingId = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const selected = options.find(option => option.id === value) ?? options[0]
  const filtered = options.filter(option => option.label.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    const desktop = matchMedia("(min-width: 640px)")
    const close = () => { if (desktop.matches) dialog.current?.close() }
    desktop.addEventListener("change", close)
    return () => desktop.removeEventListener("change", close)
  }, [])

  useEffect(() => {
    if (!open) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = overflow }
  }, [open])

  return <>
    <button id={triggerId} type="button" className="mobile-category-trigger sm:hidden" aria-label={`${title}: ${selected.label}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => {
      setQuery("")
      dialog.current?.showModal()
      setOpen(true)
    }}>
      <span>{selected.label}</span><ChevronDown size={18} aria-hidden="true" />
    </button>
    <dialog ref={dialog} className="mobile-category-dialog" aria-labelledby={headingId} onClose={() => setOpen(false)} onKeyDown={event => {
      if (event.key === "Escape") {
        event.preventDefault()
        dialog.current?.close()
      }
    }} onClick={event => {
      if (event.target === event.currentTarget) dialog.current?.close()
    }}>
      <div className="mobile-category-sheet">
        <div className="mobile-category-heading">
          <h2 id={headingId}>{title}</h2>
          <button type="button" aria-label={`Close ${title.toLowerCase()}`} title={`Close ${title.toLowerCase()}`} onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button>
        </div>
        {searchable && <label className="mobile-category-search">
          <span className="sr-only">{searchLabel}</span>
          <Search size={18} aria-hidden="true" />
          <input type="search" placeholder={searchLabel} value={query} onChange={event => setQuery(event.target.value)} />
        </label>}
        <div className="mobile-category-options">
          {filtered.map(category => <button key={category.id} type="button" aria-pressed={value === category.id} onClick={() => {
            onChange(category.id)
            dialog.current?.close()
          }}>
            <span>{category.label}</span>{value === category.id && <Check size={20} aria-hidden="true" />}
          </button>)}
          {!filtered.length && <p role="status">No matching options</p>}
        </div>
      </div>
    </dialog>
  </>
}
