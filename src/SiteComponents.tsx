import { useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronDown, ExternalLink, Menu, X } from "lucide-react"
import { equipmentCategories, equipmentCategoryHref } from "./equipment-categories"
import { enquiryHref, footerLegalLinks, footerSocialLinks } from "./site-links"
import { companyProfile } from "./company-profile"
import "./site-header.css"

const navigation = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Equipment & Tools", "/equipment-tools"],
  ["Contact", "/contact"],
]


export function navigate(path: string) {
  window.location.assign(path)
}

export function Heading({
  children,
  level = 2,
  className = "",
}: {
  children: React.ReactNode
  level?: number
  className?: string
}) {
  const Tag =
    `h${Math.min(6, Math.max(1, level))}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  return (
    <Tag
      role="heading"
      aria-level={level}
      className={`site-heading min-w-0 break-words font-condensed font-bold ${
        className.includes("text-white") ? "" : "text-zadco-navy"
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

export function Label({
  children,
  inverse = false,
}: {
  children: React.ReactNode
  inverse?: boolean
}) {
  return (
    <p
      className={`site-eyebrow text-xs font-semibold ${
        inverse ? "text-neutral-300" : "text-neutral-500"
      }`}
    >
      {children}
    </p>
  )
}

export function Placeholder({
  label,
  className = "",
  dark = false,
}: {
  label: "VIDEO" | "INDUSTRIAL IMAGE" | "PRODUCT IMAGE" | "SOURCING CATEGORY"
  className?: string
  dark?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center border ${
        dark
          ? "border-neutral-600 bg-neutral-800 text-neutral-400"
          : "border-neutral-300 bg-neutral-200 text-neutral-500"
      } ${className}`}
    >
      <span className="px-2 text-center text-xs font-semibold tracking-widest">
        {label}
      </span>
    </div>
  )
}

export function Action({
  children,
  path,
  inverse = false,
  outlined = false,
  navy = false,
}: {
  children: React.ReactNode
  path: string
  inverse?: boolean
  outlined?: boolean
  navy?: boolean
}) {
  return (
    <a
      href={path}
      className={`site-button site-button--${inverse ? outlined ? "inverse-outline" : "inverse" : navy ? "navy" : outlined ? "outline" : "primary"}`}
    >
      {typeof children === "string" ? children.replace(/\s*→\s*$/, "") : children}
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  )
}

export function TextLink({
  children,
  path,
}: {
  children: React.ReactNode
  path: string
}) {
  return (
    <a
      href={path}
      className="site-text-link"
    >
      {typeof children === "string" ? children.replace(/\s*→\s*$/, "") : children}
      {typeof children === "string" && children.trim().endsWith("→") && <ArrowRight size={18} aria-hidden="true" />}
    </a>
  )
}

export function SiteHeader({
  active,
  overlay = false,
}: {
  active: string
  overlay?: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileEquipmentOpen, setMobileEquipmentOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [equipmentOpen, setEquipmentOpen] = useState(false)
  const equipmentMenu = useRef<HTMLDivElement>(null)
  const equipmentToggle = useRef<HTMLButtonElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  const closeMobileMenu = () => {
    setMenuOpen(false)
    setMobileEquipmentOpen(false)
  }

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 48)
    updateScroll()
    window.addEventListener("scroll", updateScroll, { passive: true })
    return () => window.removeEventListener("scroll", updateScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setMobileEquipmentOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  useEffect(() => {
    if (!equipmentOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (!equipmentMenu.current?.contains(event.target as Node)) setEquipmentOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [equipmentOpen])

  return (
    <>
    {!overlay && <div className="site-header-spacer" aria-hidden="true" />}
    <header className={`site-header${overlay ? " site-header--overlay" : ""}${scrolled ? " site-header--scrolled" : ""}`}>
      <div className="site-header-inner">
        <a href="/" className="site-header-logo" aria-label="ZADCO home">
          <img src="/images/zadco-oilfield-trading-logo.png" alt="ZADCO Oilfield Trading LLC" width={2172} height={724} />
        </a>
        <nav className="site-header-nav" aria-label="Primary navigation">
          {navigation.map(([label, path]) => label === "Equipment & Tools" ? (
            <div
              key={label}
              ref={equipmentMenu}
              className="site-header-equipment"
              onMouseEnter={() => setEquipmentOpen(true)}
              onMouseLeave={() => setEquipmentOpen(false)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setEquipmentOpen(false) }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault()
                  setEquipmentOpen(false)
                  equipmentToggle.current?.focus()
                }
              }}
            >
              <a href={path} aria-current={active === label ? "page" : undefined}>{label}</a>
              <button
                ref={equipmentToggle}
                type="button"
                className="site-header-category-toggle"
                aria-label="Equipment & Tools categories"
                aria-expanded={equipmentOpen}
                aria-controls="desktop-equipment-categories"
                onClick={(event) => setEquipmentOpen(event.detail === 0 ? !equipmentOpen : true)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault()
                    setEquipmentOpen(true)
                    requestAnimationFrame(() => equipmentMenu.current?.querySelector<HTMLAnchorElement>(".site-header-category-panel a")?.focus())
                  }
                }}
              >
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              <div id="desktop-equipment-categories" className="site-header-category-panel" hidden={!equipmentOpen}>
                <a className="site-header-category-all" href={equipmentCategoryHref()} onClick={() => setEquipmentOpen(false)}>All Equipment &amp; Tools <ArrowRight size={16} aria-hidden="true" /></a>
                {equipmentCategories.map(({ id, label: category }) => (
                  <a key={id} href={equipmentCategoryHref(id)} onClick={() => setEquipmentOpen(false)}>{category}</a>
                ))}
              </div>
            </div>
          ) : (
            <a
              key={label}
              href={path}
              aria-current={active === label ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="site-header-quote site-button site-button--navy" href={enquiryHref}>Request a quote <ArrowRight size={18} aria-hidden="true" /></a>
        <button ref={menuButton} className="site-header-menu-toggle" type="button" title={menuOpen ? "Close menu" : "Open menu"} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="site-mobile-navigation" onClick={() => { if (menuOpen) closeMobileMenu(); else setMenuOpen(true) }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <nav
        id="site-mobile-navigation"
        hidden={!menuOpen}
        aria-label="Mobile navigation"
        className="site-header-mobile-nav"
      >
        {navigation.map(([label, path]) => label === "Equipment & Tools" ? (
          <div key={label} className="site-header-mobile-equipment">
            <div className="site-header-mobile-equipment-row">
              <a href={path} aria-current={active === label ? "page" : undefined} onClick={closeMobileMenu}>{label}</a>
              <button
                type="button"
                className="site-header-mobile-category-toggle"
                aria-label="Equipment & Tools categories"
                title={mobileEquipmentOpen ? "Hide equipment categories" : "Show equipment categories"}
                aria-expanded={mobileEquipmentOpen}
                aria-controls="mobile-equipment-categories"
                onClick={() => setMobileEquipmentOpen(!mobileEquipmentOpen)}
              >
                <ChevronDown size={20} aria-hidden="true" />
              </button>
            </div>
            <div id="mobile-equipment-categories" className="site-header-mobile-categories" hidden={!mobileEquipmentOpen}>
              <a href={equipmentCategoryHref()} onClick={closeMobileMenu}>All Equipment &amp; Tools</a>
              {equipmentCategories.map(({ id, label: category }) => (
                <a key={id} href={equipmentCategoryHref(id)} onClick={closeMobileMenu}>{category}</a>
              ))}
            </div>
          </div>
        ) : (
          <a
            key={label}
            href={path}
            aria-current={active === label ? "page" : undefined}
            onClick={closeMobileMenu}
          >
            {label}
          </a>
        ))}
        <a className="site-button site-button--navy site-header-mobile-quote" href={enquiryHref} onClick={closeMobileMenu}>Request a quote <ArrowRight size={18} aria-hidden="true" /></a>
      </nav>
    </header>
    </>
  )
}

export function SiteFooter({
  tagline = "Equipment, industrial tools and petrochemical sourcing for energy and industrial requirements.",
  showInstagram = true,
  showOilfieldEquipment = true,
}: {
  tagline?: string
  showInstagram?: boolean
  showOilfieldEquipment?: boolean
} = {}) {
  return (
    <footer className="site-footer bg-zadco-navy py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="site-footer-grid grid grid-cols-1 gap-x-6 gap-y-10 border-b border-neutral-700 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12">
          <div className="site-footer-brand sm:col-span-2 lg:col-span-3 xl:col-span-3">
            <a href="/" aria-label="ZADCO home" className="site-footer-logo inline-flex w-full max-w-55 items-center">
              <img src="/images/zadco-oilfield-trading-logo-reversed.png" alt="ZADCO Oilfield Trading LLC" width={2172} height={724} className="block h-auto w-full object-contain object-left" loading="lazy" />
            </a>
            <p className="site-footer-tagline mt-5 max-w-sm text-sm leading-6 text-neutral-400">
              {tagline}
            </p>
            {footerSocialLinks.some(({ platform }) => showInstagram || platform !== "Instagram") && (
              <div className="mt-6 flex flex-wrap gap-3">
                {footerSocialLinks.filter(({ platform }) => showInstagram || platform !== "Instagram").map(({ platform, href }) => (
                  <a key={platform} href={href} target="_blank" rel="noopener noreferrer" aria-label={`ZADCO on ${platform}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-300 hover:text-white hover:underline underline-offset-4">{platform}<ExternalLink size={14} aria-hidden="true" /></a>
                ))}
              </div>
            )}
          </div>
          <div className="min-w-0 xl:col-span-2">
            <Label inverse>NAVIGATION</Label>
            <nav aria-label="Footer navigation" className="site-footer-links mt-5 flex flex-col gap-3 text-sm text-neutral-300">
              {navigation.map(([label, path]) => (
                <a
                  key={label}
                  href={path}
                  className="hover:text-white hover:underline underline-offset-4"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="min-w-0 xl:col-span-3">
            <Label inverse><span className="sm:hidden">PRODUCTS</span><span className="hidden sm:inline">PRODUCTS &amp; SOLUTIONS</span></Label>
            <div className="site-footer-links mt-5 flex flex-col gap-3 text-sm text-neutral-300">
              <a href="/equipment-tools" className="hover:text-white hover:underline underline-offset-4">Equipment &amp; Tools</a>
              {showOilfieldEquipment && <a href="/equipment-tools" className="hover:text-white hover:underline underline-offset-4">Oilfield Equipment</a>}
              <a href="/petrochemicals" className="hover:text-white hover:underline underline-offset-4">Petrochemicals &amp; Chemicals</a>
              <a href={enquiryHref} className="hover:text-white hover:underline underline-offset-4">Sourcing &amp; Supply</a>
            </div>
          </div>
          <div className={`site-footer-contact min-w-0 ${footerLegalLinks.length ? "xl:col-span-2" : "xl:col-span-4"}`}>
            <Label inverse>CONTACT</Label>
            <div className="site-footer-contact-details mt-5 flex flex-col gap-3 text-sm text-neutral-300">
              {companyProfile.phone && <a href={`tel:${companyProfile.phone.replace(/[^+\d]/g, "")}`} className="hover:text-white hover:underline underline-offset-4">{companyProfile.phone}</a>}
              {companyProfile.email && <a href={`mailto:${companyProfile.email}`} className="hover:text-white hover:underline underline-offset-4">{companyProfile.email}</a>}
              {companyProfile.location && <p>{companyProfile.location}</p>}
              {companyProfile.legalName && <p>{companyProfile.legalName}</p>}
              <a href={enquiryHref} className="inline-flex items-center gap-2 text-white hover:text-zadco-orange">Send an enquiry <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          {footerLegalLinks.length > 0 && <div className="site-footer-legal min-w-0 xl:col-span-2">
            <Label inverse>LEGAL</Label>
            <div className="mt-5 flex flex-col gap-3 text-sm text-neutral-300">
              {footerLegalLinks.map(({ label, href }) => <a key={label} href={href} className="hover:text-white hover:underline underline-offset-4">{label}</a>)}
            </div>
          </div>}
        </div>
        <div className="pt-6 text-xs text-neutral-500">
          <span>© 2026 ZADCO. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export function Field({
  label,
  large = false,
}: {
  label: string
  large?: boolean
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wider text-neutral-600">
        {label}
      </p>
      <div
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        aria-label={label}
        className={`border border-neutral-400 bg-white p-4 text-sm text-neutral-500 outline-none focus:border-neutral-950 ${
          large ? "h-32" : "h-12"
        }`}
      />
    </div>
  )
}
