import ResponsiveImage from "./ResponsiveImage";
import { useState } from "react"
import { SiteFooter, SiteHeader } from "./SiteComponents"
import { ArrowRight, Award, ChevronDown, FileText, HardHat, Handshake, Search, ShieldCheck, Truck, Users } from "lucide-react"
import { enquiryHref } from "./site-links"
import "./about-page.css"
import "./about-purpose.css"
import "./about-commitments.css"
import "./about-mobile.css"

export default function AboutPage() {
  const [openSupplyArea, setOpenSupplyArea] = useState<number | null>(null)
  return <div className="about-page">
    <a className="about-skip" href="#about-main">Skip to content</a>
    <SiteHeader active="About Us" />
    <main id="about-main" tabIndex={-1}>
      <section className="about-intro industrial-surface industrial-arcs-corner" aria-labelledby="about-title">
        <div className="about-intro-inner industrial-content">
          <p className="about-eyebrow">About ZADCO</p>
          <h1 id="about-title">ZADCO Oilfield Trading</h1>
          <p className="about-intro-description">ZADCO Oilfield Trading LLC sources and supplies oilfield equipment, industrial tools, spare parts and petrochemicals for the oil, gas and energy sectors. Through local and international supply channels, we review your technical requirements, identify suitable options and coordinate the commercial and delivery details.</p>
          <a className="about-button about-button-orange about-intro-action" href={enquiryHref}>Send a sourcing brief <ArrowRight size={19} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="about-video-section" aria-labelledby="about-video-title">
        <div className="about-container">
          <h2 id="about-video-title" className="sr-only">Introducing ZADCO Oilfield Trading</h2>
          <video className="about-company-video" controls playsInline preload="none" poster="/videos/zadco-introduction-poster.jpg" aria-labelledby="about-video-title">
            <source src="/videos/zadco-introduction.mp4" type="video/mp4" />
            Your browser does not support embedded video. <a href="/videos/zadco-introduction.mp4">Watch the ZADCO introduction</a>.
          </video>
        </div>
      </section>

      <section className="site-section" aria-labelledby="about-scope-title">
        <div className="about-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="about-eyebrow">OUR BUSINESS</p>
            <h2 id="about-scope-title" className="mt-5 font-condensed text-4xl font-bold">Oilfield trading and supply, guided by your brief</h2>
            <p className="mt-5 text-base leading-7 text-zadco-grey">We trade and supply equipment, tools, machinery, spare parts, accessories and related materials, including import, export and distribution. Our range also covers petrochemicals, lubricants, chemicals and industrial fluids.</p>
            <p className="mt-4 text-base leading-7 text-zadco-grey">Our supply scope supports drilling, well construction, completion, testing, production, intervention, maintenance and general oilfield operations. We review technical specifications, equipment lists and operational needs to identify suitable supply options and coordinate commercial and delivery arrangements.</p>
          </div>
          <div className="divide-y divide-zadco-grey/25 border-y border-zadco-grey/25">
            {[
              ["Oilfield equipment & machinery", "Equipment supporting drilling, well construction, completion, testing, production and well intervention requirements.", "/equipment-tools"],
              ["Industrial tools, spare parts & accessories", "Specialised tools, replacement components, fittings, accessories and related materials sourced according to equipment specifications and operational requirements.", "/equipment-tools"],
              ["Petrochemicals & industrial fluids", "Production and industrial chemicals, petrochemical products, lubricants and fluids selected for the intended application.", "/petrochemicals"],
            ].map(([title, copy, href], index) => <div key={title} className="about-supply-area py-6">
              <h3 className="font-condensed text-2xl font-bold">
                <a href={href} className="about-supply-area-link hover:text-zadco-orange">{title}</a>
                <button type="button" className="about-supply-area-toggle" aria-expanded={openSupplyArea === index} aria-controls={`about-supply-area-${index}`} onClick={() => setOpenSupplyArea(current => current === index ? null : index)}>
                  <span>{title}</span><ChevronDown size={18} aria-hidden="true" />
                </button>
              </h3>
              <div id={`about-supply-area-${index}`} className={`about-supply-area-panel ${openSupplyArea === index ? "is-open" : ""}`}>
                <p className="mt-2 text-sm leading-6 text-zadco-grey">{copy}</p>
                <a className="about-supply-area-action site-text-link" href={href}>Explore products <ArrowRight size={16} aria-hidden="true" /></a>
              </div>
            </div>)}
          </div>
        </div>
      </section>

      <section className="about-purpose industrial-surface industrial-grid industrial-arcs-end" aria-labelledby="about-direction-title">
        <div className="about-container industrial-content">
        <div className="about-purpose-header">
          <div className="about-purpose-intro">
            <p className="about-eyebrow">OUR DIRECTION</p>
            <h2 id="about-direction-title">Our Vision.<br /><span>Our Mission.</span></h2>
            <p>A clear direction for how we source, support customers and build lasting supply relationships.</p>
          </div>
          <figure className="about-purpose-visual">
            <ResponsiveImage sizes="(max-width: 700px) calc(100vw - 48px), (max-width: 1280px) 45vw, 576px" className="about-purpose-image" src="/images/industry-refinery.jpg" alt="Oilfield processing facility" loading="lazy" decoding="async" />
            <figcaption>Supporting the energy sector <ArrowRight size={18} aria-hidden="true" /></figcaption>
          </figure>
        </div>
        <ol className="about-purpose-list">
          {[
            {
              heading: "Our Vision",
              points: [
                "To be a trusted and preferred supply partner for oilfield equipment, petrochemicals and industrial tools.",
                "Support the energy sector with reliable sourcing, quality products and responsive service.",
                "Build long-term customer relationships through integrity, clear communication and dependable supply.",
                "Continue strengthening our product range and sourcing capabilities to meet changing customer requirements.",
              ],
            },
            {
              heading: "Our Mission",
              points: [
                "Source and supply certified oilfield equipment, petrochemicals and industrial tools that meet customer specifications and applicable international standards.",
                "Support the supply process through efficient logistics, technical coordination and responsive service.",
                "Deliver consistent value with a strong focus on safety, quality and customer satisfaction.",
              ],
            },
          ].map(({ heading, points }, index) => (
            <li className="about-purpose-item" key={heading}>
                <span className="about-purpose-number" aria-hidden="true">0{index + 1}</span>
                <div className="about-purpose-copy">
                  <h3>{heading}</h3>
                  <p className="about-purpose-full-copy">{points.join(" ")}</p>
                  <div className="about-purpose-mobile-copy">
                    <p>{points[0]}</p>
                    <details className="about-purpose-more">
                      <summary>Read full {index === 0 ? "vision" : "mission"}<ChevronDown size={16} aria-hidden="true" /></summary>
                      <ul>{points.slice(1).map(point => <li key={point}>{point}</li>)}</ul>
                    </details>
                  </div>
                </div>
            </li>
          ))}
        </ol>
        </div>
      </section>

      <section className="site-section about-commitments" aria-labelledby="about-commitments-title">
        <div className="about-container about-commitments-inner">
          <div className="about-commitments-heading">
          <p className="about-eyebrow">CORE COMMITMENTS</p>
          <h2 id="about-commitments-title" className="site-heading mt-5">Our commitments to you</h2>
          <p className="about-commitments-intro">Reliable supply begins with understanding the requirement. We review technical specifications, application, quantity, documentation and delivery expectations before identifying suitable sourcing options.</p>
          </div>
          <dl className="about-commitments-list">
            {[
              ["Quality", "A commitment to applicable international standards and customer specifications."],
              ["Safety", "Health, safety and environmental considerations throughout sourcing, handling and delivery."],
              ["Reliability", "Dependable supply coordination and a focus on agreed delivery schedules."],
              ["Integrity", "Ethical business practices, transparent communication and responsible partnerships."],
              ["Customer Focus", "Practical solutions shaped around your application, priorities and project needs."],
            ].map(([title, copy], index) => {
              const Icon = [Award, HardHat, Truck, Handshake, Users][index]
              return <div className="about-commitment" key={title}>
                <div className="about-commitment-icon" aria-hidden="true"><Icon size={36} strokeWidth={1.6} /></div>
                <div className="about-commitment-copy"><dt>{title}</dt><dd>{copy}</dd></div>
              </div>
            })}
          </dl>
        </div>
      </section>

      <section className="site-section about-supply bg-white text-zadco-navy" aria-labelledby="about-supply-title">
        <div className="about-container">
          <p className="about-eyebrow">BEFORE YOU ORDER</p>
          <div className="mt-5 grid items-center gap-5 lg:grid-cols-2 lg:gap-16">
            <h2 id="about-supply-title" className="site-heading max-w-lg">Define your requirements before you order</h2>
            <p className="text-base leading-7 text-zadco-grey">Include documents, inspections and delivery arrangements in your enquiry. Confirm availability, costs and responsibilities before ordering.</p>
          </div>
          <dl className="mt-8 grid gap-x-16 border-b border-zadco-grey/25 md:mt-10 md:grid-cols-2">
            {[
              ["Technical documentation", "Identify the datasheets, dimensions, material specifications and manufacturer information your application needs."],
              ["Certificates & traceability", "List the required certificates, test reports, origin records or chemical safety documents."],
              ["Inspection requirements", "Specify any pre-dispatch or third-party inspection so its scope and cost can be agreed."],
              ["Delivery arrangements", "Set out the destination, packaging, target date and delivery terms, including transport responsibilities."],
            ].map(([title, copy], index) => {
              const Icon = [FileText, ShieldCheck, Search, Truck][index]
              return <div key={title} className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-4 border-t border-zadco-grey/25 py-6 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-6 sm:py-8">
                <Icon className="mt-1 h-7 w-7 text-zadco-orange sm:h-10 sm:w-10" strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <dt>
                    <span className="mb-2 block font-condensed text-sm font-bold tabular-nums text-zadco-grey" aria-hidden="true">0{index + 1}</span>
                    <span className="font-condensed text-[length:var(--site-item-title-size)] font-bold leading-tight">{title}</span>
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-zadco-grey sm:text-base sm:leading-7">{copy}</dd>
                </div>
              </div>
            })}
          </dl>
          <a href={enquiryHref} className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-zadco-orange hover:text-zadco-navy">
            <span className="underline underline-offset-4">Discuss your requirements</span><ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="about-connect" aria-labelledby="about-connect-title">
        <div className="about-container about-connect-inner">
          <div>
            <h2 id="about-connect-title">Discuss your sourcing requirements</h2>
            <p>Share your equipment list or specification so we can review the scope of your enquiry.</p>
          </div>
          <a href={enquiryHref}>Discuss your requirement <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
}
