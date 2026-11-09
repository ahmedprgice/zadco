import ResponsiveImage from "./ResponsiveImage";
import { ArrowRight, ChevronDown, ClipboardCheck, MessageSquare, Search, ShieldCheck } from "lucide-react"
import { useState } from "react"
import MobileSelectSheet from "./MobileSelectSheet"
import PriorityProductGroups from "./PriorityProductGroups"
import { equipmentCategories } from "./equipment-categories"
import "./home-equipment-finder.css"
import "./category-select.css"
import "./home-hero.css"
import "./home-process.css"
import "./home-why.css"
import "./home-cta-editorial.css"
import "./home-supply.css"
import {
  Action,
  Heading,
  Label,
  SiteFooter,
  SiteHeader,
  TextLink,
} from "./SiteComponents"

const equipment = [
  ["Pumps", "General Equipment", "/images/equipment-pumps.png", "Centrifugal pump skid"],
  ["Compressors", "General Equipment", "/images/equipment-compressors.png", "Gas compressor skid"],
  ["Separators", "Production", "/images/equipment-separators.png", "Horizontal oil and gas separator"],
  ["Wellheads", "Well Construction", "/images/equipment-wellheads.png", "Wellhead assembly"],
  ["Christmas Trees", "Production", "/images/equipment-christmas-trees.png", "Production Christmas tree valve assembly"],
  ["Drill Bits", "Drilling", "/images/equipment-drill-bits.png", "Oilfield drilling bits"],
  ["Casing & Tubing", "Well Construction", "/images/company-overview-pipelines.jpg", "Stacked steel tubing"],
  ["Coiled Tubing Equipment", "Intervention", "/images/equipment-coiled-tubing.png", "Coiled tubing intervention unit"],
]

export default function HomePage() {
  const [finderCategory, setFinderCategory] = useState("")
  return (
    <main className="min-w-0 bg-white text-neutral-950">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <ResponsiveImage sizes="100vw" className="home-hero-image" src="/images/home-offshore-hero.png" alt="" fetchPriority="high" />
        <div className="home-hero-shade" />
        <SiteHeader active="Home" overlay />
        <div className="home-hero-content">
          <h1 id="home-hero-title">Oilfield Trading &amp; Technical Product Support</h1>
          <p>We trade and supply oilfield equipment, tools, spare parts and chemicals, supported by technical product assistance.</p>
          <div className="home-hero-actions">
            <a className="home-hero-explore site-button site-button--inverse-outline" href="/equipment-tools">Explore Products <ArrowRight size={18} aria-hidden="true" /></a>
            <a className="home-hero-support site-button" href="/about#technical-support">Technical Support <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="home-equipment-finder" aria-labelledby="equipment-finder-title">
        <div className="home-equipment-finder-inner">
          <div className="home-equipment-finder-heading">
            <h2 id="equipment-finder-title">Find Equipment</h2>
            <a href="/contact#rfq">Send a requirement <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <form action="/equipment-tools#catalogue" method="get" role="search" aria-label="Find equipment" className="home-equipment-finder-form">
            <div className="home-equipment-finder-search">
              <Search size={20} aria-hidden="true" />
              <label className="sr-only" htmlFor="home-equipment-search">Equipment name</label>
              <input id="home-equipment-search" name="q" type="search" placeholder="Search equipment..." />
            </div>
            <label className="sr-only" htmlFor="home-equipment-category">Equipment category</label>
            <MobileSelectSheet title="Equipment category" value={finderCategory} onChange={setFinderCategory} searchable searchLabel="Search categories" options={[{ id: "", label: "All equipment categories" }, ...equipmentCategories]} />
            <div className="home-equipment-finder-category hidden sm:block">
            <select id="home-equipment-category" name="category" className="equipment-category-select" value={finderCategory} onChange={event => setFinderCategory(event.target.value)}>
              <option value="">All equipment categories</option>
              {equipmentCategories.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
            </select>
            <ChevronDown size={18} aria-hidden="true" />
            </div>
            <button type="submit" className="site-button site-button--navy"><Search size={18} aria-hidden="true" />Search</button>
          </form>
        </div>
      </section>

      <PriorityProductGroups />

      <section className="home-supply industrial-surface industrial-arcs-end" aria-labelledby="home-supply-title">
        <div className="home-supply-inner">
          <div className="home-supply-heading">
            <p>WHAT WE SUPPLY</p>
            <h2 id="home-supply-title">Equipment and materials for energy operations</h2>
          </div>
          <div className="home-supply-grid">
            {[
              [
                "Equipment & Tools",
                "Source equipment, machinery and industrial tools for drilling, well construction, production and maintenance.",
                "EXPLORE EQUIPMENT",
                "/equipment-tools",
              ],
              [
                "Petrochemicals",
                "Production chemicals, drilling fluids, flow-assurance products, lubricants and related industrial fluids.",
                "EXPLORE PETROCHEMICALS",
                "/petrochemicals",
              ],
              [
                "Sourcing Requests",
                "Have a specific requirement? Send your equipment list, part numbers or technical specification for review.",
                "SEND A REQUIREMENT",
                "/contact#rfq",
              ],
            ].map(([title, copy, link, path], index) => (
              <article
                key={title}
                className="home-supply-card"
              >
                <div className={`home-supply-image home-supply-image-${index + 1}`} role="img" aria-label={["Oilfield valve and offshore platform", "Industrial petrochemical storage tanks", "Steel pipes at a refinery"][index]}>
                  <span className="home-supply-number">0{index + 1}</span>
                </div>
                <div className="home-supply-body">
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <a href={path} className="home-supply-link">
                    <span>{link}</span>
                    <span className="home-supply-arrow"><ArrowRight size={20} strokeWidth={2} aria-hidden="true" /></span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section industrial-surface industrial-grid industrial-arcs-start bg-zadco-soft">
        <div className="industrial-content mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Label>FEATURED EQUIPMENT</Label>
              <Heading className="mt-5 text-3xl sm:text-4xl lg:text-5xl">
                Equipment We Supply
              </Heading>
            </div>
            <Action path="/equipment-tools" outlined>
              VIEW ALL EQUIPMENT
            </Action>
          </div>
          <p className="mt-5 text-sm leading-6 text-zadco-grey">Explore our sourcing range. Images are illustrative; product specifications and availability are confirmed with your quotation.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-neutral-300">
            {equipment.map(([name, category, image, description], index) => (
              <article
                key={name}
                className="border-b border-r border-neutral-300"
              >
                <ResponsiveImage
                  src={image}
                  alt={`Representative ${description.toLowerCase()}`}
                  loading="lazy"
                  decoding="async"
                  className="site-product-image block w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xs tracking-wider text-neutral-500">
                    {category}
                  </p>
                  <Heading level={3} className="mt-2 text-xl">
                    {name}
                  </Heading>
                  <div className="mt-5">
                    <TextLink path="/equipment-tools">
                      VIEW EQUIPMENT →
                    </TextLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="home-why-process">
      <section className="home-why" aria-label="Why ZADCO">
        <div className="industrial-content home-why-layout mx-auto max-w-7xl px-4 sm:px-6">
          <div className="home-why-intro">
            <p className="home-why-label">WHY ZADCO</p>
            <Heading className="home-why-title">
              Sourcing shaped around your requirements
            </Heading>
            <p className="home-why-summary">
              Equipment matched to your brief, with clear quotations and responsive support.
            </p>
          </div>
          <div className="home-why-benefits">
            {[
              ["01", "Reliable Sourcing", "Supply options matched to your specification, quantity and delivery needs."],
              [
                "02",
                "Quality Focus",
                "Product suitability, applicable standards and documentation reviewed against your brief.",
              ],
              [
                "03",
                "Responsive Support",
                "Clear communication and practical follow-up from enquiry to quotation.",
              ],
            ].map(([number, title, copy], index) => {
              const Icon = [ClipboardCheck, ShieldCheck, MessageSquare][index]
              return (
              <article
                key={number}
                className="home-why-benefit"
              >
                <div className="home-why-benefit-marker" aria-hidden="true">
                  <Icon size={36} strokeWidth={1.6} className="home-why-icon" />
                  <span className="home-why-number">{number}</span>
                </div>
                <div className="home-why-benefit-copy">
                  <Heading level={3} className="home-why-benefit-title">
                    {title}
                  </Heading>
                  <p>{copy}</p>
                </div>
              </article>
            )})}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/contact#rfq" className="home-why-enquiry">Discuss your sourcing requirements <ArrowRight size={18} aria-hidden="true" /></a>
            <a href="/about#technical-support" className="home-why-enquiry">Technical Support <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="site-section industrial-surface industrial-process home-process">
        <div className="industrial-content mx-auto max-w-7xl px-4 sm:px-6">
          <Label>HOW IT WORKS</Label>
          <Heading className="mt-5 text-3xl sm:text-4xl lg:text-5xl">
            From Requirement to Supply
          </Heading>
          <ol className="home-process-steps">
            {[
              {
                title: "Send Requirement",
                copy: "Send your specification, quantity and delivery destination.",
              },
              {
                title: "We Source",
                copy: "We review supplier options against your brief.",
              },
              {
                title: "Receive Quotation",
                copy: "Review the proposed product, pricing and lead time.",
              },
              {
                title: "Supply Coordination",
                copy: "Agree documentation and delivery arrangements before ordering.",
              },
            ].map(({ title, copy }, index) => (
              <li className="home-process-step" key={title}>
                <span className="home-process-marker" aria-hidden="true" />
                <span className="home-process-number">0{index + 1}</span>
                <span className="home-process-name">{title}</span>
                <span className="home-process-copy">{copy}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      </div>

      <section className="home-cta" aria-labelledby="home-cta-title">
        <div className="home-cta-inner">
          <ResponsiveImage sizes="(max-width: 1023px) 100vw, 50vw" className="home-cta-image" src="/images/industry-refinery.jpg" alt="" loading="lazy" decoding="async" />
          <div className="home-cta-content">
            <p className="home-cta-label">ENQUIRE NOW</p>
            <h2 id="home-cta-title">Tell us what you need to source</h2>
            <p className="home-cta-description">Share your equipment list, part numbers or technical specification, along with quantities and delivery requirements.</p>
            <div className="home-cta-buttons">
              <a className="home-cta-button home-cta-button-primary" href="/contact#rfq">
                REQUEST A QUOTE <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
