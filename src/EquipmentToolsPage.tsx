import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { equipmentCategories, filterEquipmentProducts } from "./equipment-categories"
import type { EquipmentReferencePhoto } from "./equipment-categories"
import EquipmentReferenceImage from "./EquipmentReferenceImage"
import MobileSelectSheet from "./MobileSelectSheet"
import PriorityProductGroups from "./PriorityProductGroups"
import "./equipment-tools.css"
import "./category-select.css"
import { useRouteLocation } from "./route-location"
import { applyPageSeo } from "./seo"
import {
  Action,
  Heading,
  SiteFooter,
  SiteHeader,
  TextLink,
} from "./SiteComponents"

const rigImage =
  "https://images.unsplash.com/photo-1578356058390-f58c575337a2?auto=format&fit=crop&w=1600&q=85"

function EquipmentImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) {
  return (
    <div className={`overflow-hidden bg-zadco-soft ${className}`}>
      <ResponsiveImage
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  )
}

function CatalogueCard({
  category,
  title,
  description,
  id,
  referencePhoto,
}: {
  category: string
  title: string
  description: string
  id: string
  referencePhoto?: EquipmentReferencePhoto
}) {
  return (
    <article className="flex min-h-full flex-col border border-zadco-grey/25 border-t-2 border-t-zadco-orange bg-white">
      {referencePhoto ? <EquipmentReferenceImage photo={referencePhoto} /> : <div role="img" aria-label={`Image placeholder for ${title}`} className="site-product-image flex items-center justify-center border-b border-neutral-200 bg-neutral-100 text-neutral-400">
        <ImageIcon size={36} strokeWidth={1.5} aria-hidden="true" />
      </div>}
      <div className="flex flex-1 flex-col p-5">
        <p className="border-l-2 border-zadco-orange pl-2 font-condensed text-xs font-bold text-zadco-navy">{category}</p>
        <Heading level={3} className="mt-3 text-xl leading-tight">
          {title}
        </Heading>
        <p className="mt-3 text-sm leading-5 text-zadco-grey">{description}</p>
        <div className="mt-auto pt-5">
          <TextLink path={`/equipment-tools/product/${id}`}>
            VIEW DETAILS →
          </TextLink>
          <div className="mt-4">
            <Action path={`/contact?product=${encodeURIComponent(title)}#rfq`} outlined>
              REQUEST QUOTE
            </Action>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function EquipmentToolsPage() {
  const routeLocation = useRouteLocation()
  const readCategory = () => {
    const id = new URLSearchParams(typeof window === "undefined" ? routeLocation.search : window.location.search).get("category") ?? ""
    return equipmentCategories.some((category) => category.id === id) ? id : ""
  }
  const [categoryId, setCategoryId] = useState(readCategory)
  const readSearch = () => new URLSearchParams(typeof window === "undefined" ? routeLocation.search : window.location.search).get("q") ?? ""
  const [search, setSearch] = useState(readSearch)
  const [pageSize, setPageSize] = useState(12)
  const [page, setPage] = useState(1)
  const selectedCategory = equipmentCategories.find((category) => category.id === categoryId)
  const products = filterEquipmentProducts(categoryId, search, "default")
  const pageCount = pageSize ? Math.max(1, Math.ceil(products.length / pageSize)) : 1
  const currentPage = Math.min(page, pageCount)
  const visibleProducts = pageSize ? products.slice((currentPage - 1) * pageSize, currentPage * pageSize) : products
  const firstPageButton = Math.max(1, Math.min(currentPage - 1, pageCount - 2))
  const pageButtons = Array.from({ length: Math.min(3, pageCount) }, (_, index) => firstPageButton + index)
  const toolbarClass = "min-h-13 min-w-0 border border-zadco-grey/30 bg-white px-4 py-3 text-sm text-zadco-navy outline-none focus:border-zadco-orange"

  useEffect(() => {
    const phone = matchMedia("(max-width: 639px)")
    const tablet = matchMedia("(max-width: 1023px)")
    const update = () => {
      setPageSize(phone.matches ? 2 : tablet.matches ? 4 : 12)
      setPage(1)
    }
    update()
    phone.addEventListener("change", update)
    tablet.addEventListener("change", update)
    return () => {
      phone.removeEventListener("change", update)
      tablet.removeEventListener("change", update)
    }
  }, [])

  useEffect(() => setPage(1), [categoryId, search])

  function changePage(nextPage: number) {
    setPage(nextPage)
    const results = document.getElementById("catalogue-results")
    results?.focus({ preventScroll: true })
    results?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }

  function selectCategory(id: string, query = search) {
    setCategoryId(id)
    const params = new URLSearchParams()
    if (id) params.set("category", id)
    if (query.trim()) params.set("q", query.trim())
    window.history.pushState(null, "", `/equipment-tools${params.size ? `?${params}` : ""}#catalogue`)
    applyPageSeo(new URL(window.location.href))
  }

  function clearFilters() {
    setSearch("")
    selectCategory("", "")
  }

  useEffect(() => {
    const syncCategory = () => {
      setCategoryId(readCategory())
      setSearch(readSearch())
    }
    window.addEventListener("popstate", syncCategory)
    if (window.location.hash === "#catalogue") document.getElementById("catalogue")?.scrollIntoView({ block: "start", behavior: "instant" })
    return () => window.removeEventListener("popstate", syncCategory)
  }, [])

  return (
    <main className="equipment-tools-page min-w-0 bg-white text-zadco-navy [&_section_.text-neutral-950]:text-zadco-navy [&_section_.text-neutral-950:hover]:text-zadco-orange">
      <SiteHeader active="Equipment & Tools" />

      <section className="site-section industrial-surface industrial-arcs-corner bg-zadco-navy text-zadco-soft [--industrial-line:rgb(244_245_243_/_10%)] [--industrial-accent:rgb(232_117_34_/_30%)]">
        <div className="industrial-content mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12 items-center gap-8 px-4 sm:px-6">
          <div className="col-span-1 lg:col-span-6">
            <nav aria-label="Breadcrumb" className="text-xs text-zadco-soft/75">
              <ol className="flex flex-wrap items-center gap-2">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li aria-hidden="true">/</li>
                <li><span aria-current="page" className="text-zadco-orange">Equipment &amp; Tools</span></li>
              </ol>
            </nav>
            <Heading
              level={1}
              className="mt-7 text-4xl sm:text-5xl lg:text-6xl text-white"
            >
              Oilfield Equipment &amp; Industrial Tools
            </Heading>
            <p className="mt-6 max-w-xl text-base leading-7 text-zadco-soft/80">
              Source equipment, machinery, tools and spare parts for drilling, well construction,
              completion, testing, production and well intervention.
            </p>
            <div className="mt-8">
              <Action path="#catalogue">BROWSE CATALOGUE →</Action>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-6">
            <EquipmentImage
              src={rigImage}
              alt="Offshore oil rig platform"
              className="site-editorial-image"
            />
          </div>
        </div>
      </section>

      <PriorityProductGroups />

      <section id="catalogue" className="scroll-mt-28 border-b border-zadco-grey/20 bg-zadco-soft py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 sm:px-6">
          <input type="search" aria-label="Search equipment" placeholder="Search equipment..." value={search} onChange={(event) => setSearch(event.target.value)} className={`${toolbarClass} w-full sm:w-auto sm:flex-1`} />
          <MobileSelectSheet title="Equipment category" value={categoryId} onChange={selectCategory} options={[{ id: "", label: "All Categories" }, ...equipmentCategories]} searchable searchLabel="Search categories" />
          <div className="relative hidden w-72 shrink-0 sm:block">
          <select aria-label="Equipment category" value={categoryId} onChange={(event) => selectCategory(event.target.value)} className={`equipment-category-select ${toolbarClass} w-full appearance-none pr-12`}>
            <option value="">All Categories</option>
            {equipmentCategories.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zadco-navy" aria-hidden="true" />
          </div>
          <button type="button" onClick={clearFilters} className="min-h-11 shrink-0 whitespace-nowrap text-sm text-zadco-navy hover:text-zadco-orange">Clear Filters</button>
        </div>
      </section>

      <section className="site-section">
        <div id="catalogue-results" tabIndex={-1} className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6">
          <Heading className="text-3xl sm:text-4xl">
            {selectedCategory?.label ?? "Our Equipment Catalogue"}
          </Heading>
          <p role="status" className="mt-3 text-sm text-zadco-grey">{products.length} {products.length === 1 ? "item" : "items"}{search.trim() ? ` matching "${search.trim()}"` : ""}{pageCount > 1 && ` · Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, products.length)}`}</p>
          <p className="mt-3 text-sm leading-6 text-zadco-grey">Catalogue entries show the types of equipment we source. Check individual product pages for quote requirements.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {visibleProducts.map(
              ({ id, category, title, description, referencePhoto }) => (
                <CatalogueCard
                  key={id}
                  category={category}
                  title={title}
                  description={description}
                  id={id}
                  referencePhoto={referencePhoto}
                />
              ),
            )}
          </div>
          {pageCount > 1 && <nav className="equipment-pagination" aria-label="Equipment catalogue pages">
            <p>Page {currentPage} of {pageCount}</p>
            <div className="equipment-pagination-controls">
              <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} aria-label="Previous page" title="Previous page"><ChevronLeft size={18} aria-hidden="true" /><span className="hidden sm:inline">Previous</span></button>
              {pageButtons.map(number => <button type="button" key={number} onClick={() => changePage(number)} aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined}>{number}</button>)}
              <button type="button" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)} aria-label="Next page" title="Next page"><span className="hidden sm:inline">Next</span><ChevronRight size={18} aria-hidden="true" /></button>
            </div>
          </nav>}
          {products.length === 0 && <div className="border-t border-neutral-200 py-8">
            <Heading level={3}>No matching equipment</Heading>
            <p className="mt-3 text-sm text-zadco-grey">Try another category or search term.</p>
            <button type="button" onClick={clearFilters} className="site-text-link mt-3">Clear Filters</button>
          </div>}
        </div>
      </section>

      <section className="site-section relative overflow-hidden border-t-2 border-zadco-orange bg-zadco-navy text-white">
        <ResponsiveImage
          src={rigImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-15"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12 items-center gap-6 px-4 sm:px-6">
          <div className="col-span-1 lg:col-span-8">
            <Heading className="text-3xl sm:text-4xl text-white">
              Looking for Specific Equipment?
            </Heading>
            <p className="mt-4 text-base text-zadco-soft/80">
              Share your equipment list or part numbers, including quantities and
              the delivery destination, to start a sourcing enquiry.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-4 flex flex-wrap justify-start gap-3 lg:justify-end">
            <Action path="/contact#rfq" inverse>
              REQUEST A QUOTE →
            </Action>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
