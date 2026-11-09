import { useEffect, useId, useRef, useState } from "react"
import MobileSelectSheet from "./MobileSelectSheet"
import type { FormEvent } from "react"
import { companyProfile } from "./company-profile"
import { ArrowRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react"
import { Heading, Label, SiteFooter, SiteHeader } from "./SiteComponents"
import "./category-select.css"
import "./contact-page.css"
import { useRouteLocation } from "./route-location"
import { rfqAttachmentTypes, rfqEnquiryTypes, rfqFields, rfqMaxAttachments, rfqMaxAttachmentBytes } from "./rfq"

const officeLocation = companyProfile.location ?? ""
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(officeLocation)}&z=16&output=embed`
const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeLocation)}`

function SourcingBrief() {
  return <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-zadco-grey marker:text-zadco-orange">
    <li>Equipment type, manufacturer preference and part numbers.</li>
    <li>Technical specification, intended use and required condition.</li>
    <li>Quantity, destination and target delivery date.</li>
    <li>Required certificates, datasheets or inspection arrangements.</li>
  </ul>
}

function ContactField({
  name,
  placeholder,
  large = false,
  dropdown = false,
  defaultValue = "",
  options = [],
  autoComplete,
}: {
  name: keyof typeof rfqFields
  placeholder: string
  large?: boolean
  dropdown?: boolean
  defaultValue?: string
  options?: string[]
  autoComplete?: string
}) {
  const id = useId()
  const { label, maxLength } = rfqFields[name]
  const [value, setValue] = useState(defaultValue)
  const [selectionError, setSelectionError] = useState(false)
  const className = "w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm text-zadco-navy placeholder:text-neutral-400 outline-none focus:border-zadco-orange"
  return (
    <div className="contact-field">
      <label htmlFor={id} className={`mb-2 text-sm font-medium text-zadco-navy ${dropdown ? "hidden sm:block" : "block"}`}>{label} *</label>
      {dropdown && <label htmlFor={`${id}-mobile`} className="mb-2 block text-sm font-medium text-zadco-navy sm:hidden">{label} *</label>}
      {dropdown ? (
        <>
        <MobileSelectSheet triggerId={`${id}-mobile`} title="Enquiry type" value={value} onChange={next => { setValue(next); setSelectionError(false) }} options={[{ id: "", label: placeholder }, ...options.map(option => ({ id: option, label: option }))]} />
        <div className="relative hidden sm:block">
          <select id={id} name={name} required value={value} onChange={event => { setValue(event.target.value); setSelectionError(false) }} onInvalid={event => {
            if (window.matchMedia("(max-width: 639px)").matches) {
              event.preventDefault()
              setSelectionError(true)
              document.getElementById(`${id}-mobile`)?.focus()
            }
          }} className={`equipment-category-select ${className} min-h-14 appearance-none pr-12`}>
            <option value="" disabled>{placeholder}</option>
            {options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zadco-navy" aria-hidden="true" />
        </div>
        {selectionError && <p role="alert" className="mt-2 text-sm text-zadco-orange sm:hidden">Please select an enquiry type.</p>}
        </>
      ) : large ? (
        <textarea id={id} name={name} required maxLength={maxLength} defaultValue={defaultValue} placeholder={placeholder} className={`${className} min-h-32 resize-y leading-6`} />
      ) : (
        <input id={id} name={name} required maxLength={maxLength} autoComplete={autoComplete} type={name === "email" ? "email" : name === "phone" ? "tel" : "text"} defaultValue={defaultValue} placeholder={placeholder} className={`${className} min-h-14`} />
      )}
    </div>
  )
}

function ContactIcon({ type }: { type: "address" | "phone" | "email" }) {
  const Icon = { address: MapPin, phone: Phone, email: Mail }[type]
  return (
    <div className="site-icon-disc">
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
    </div>
  )
}

function ContactItem({
  type,
  label,
  children,
  accent = false,
}: {
  type: "address" | "phone" | "email"
  label: string
  children: React.ReactNode
  accent?: boolean
}) {
  return (
    <div className="contact-detail flex gap-3 sm:gap-5">
      <ContactIcon type={type} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zadco-navy">{label}</p>
        <div className={`mt-1 text-sm leading-6 ${accent ? "text-zadco-orange" : "text-zadco-grey"}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

function OfficeMap() {
  return (
    <div className="contact-map overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <iframe
        title={`Map of ${officeLocation}`}
        src={mapEmbedUrl}
        className="block h-64 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        href={mapDirectionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 border-t border-neutral-200 px-5 py-4 text-sm font-medium text-zadco-orange hover:underline"
      >
        Get directions on Google Maps <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}

export default function ContactPage() {
  const selectedProduct = useRouteLocation().searchParams.get("product")?.trim() ?? ""
  const requestId = useRef<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState("")
  const [reference, setReference] = useState("")
  const [rfqAvailability, setRfqAvailability] = useState<"checking" | "ready" | "unavailable">("checking")

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/rfq", { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(result => setRfqAvailability(result?.available === true ? "ready" : "unavailable"))
      .catch(() => {
        if (!controller.signal.aborted) setRfqAvailability("unavailable")
      })
    return () => controller.abort()
  }, [])

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (rfqAvailability !== "ready" || isSubmitting || reference) return
    const form = new FormData(event.currentTarget)
    const files = form.getAll("attachments").filter((file): file is File => file instanceof File && !!file.name)
    if (files.length > rfqMaxAttachments || files.reduce((total, file) => total + file.size, 0) > rfqMaxAttachmentBytes) {
      setSubmissionError("Attach up to five files, with a combined size of 4 MB or less.")
      return
    }
    setSubmissionError("")
    setIsSubmitting(true)
    try {
      requestId.current ??= crypto.randomUUID()
      form.set("requestId", requestId.current)
      const response = await fetch("/api/rfq", { method: "POST", body: form })
      const result = await response.json().catch(() => null)
      if (!response.ok || typeof result?.reference !== "string") {
        setSubmissionError(result?.error ?? "We couldn’t accept your enquiry. Please try again later.")
        return
      }
      setReference(result.reference)
    } catch {
      setSubmissionError("We couldn’t confirm your submission. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const target = ["#rfq", "#upload"].includes(window.location.hash) ? "rfq" : null
    if (target) document.getElementById(target)?.scrollIntoView({ block: "start", behavior: "instant" })
  }, [])

  return (
    <main className="contact-page min-w-0 bg-zadco-soft text-zadco-navy">
      <SiteHeader active="Contact" />

      <section id="rfq" className="contact-section site-section industrial-surface industrial-corner-grid scroll-mt-24">
        <div className="contact-layout industrial-content mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12 items-stretch gap-5 px-4 sm:px-6">
          <div className="contact-panel col-span-1 lg:col-span-7 h-full rounded-lg border border-neutral-200 bg-white p-5 sm:p-7 xl:p-8">
            <Label>CONTACT US</Label>
            <Heading level={1} className="mt-4 text-3xl sm:text-4xl leading-tight">
              Request a sourcing quote
            </Heading>
            <p className="mt-4 max-w-2xl text-base leading-6 text-zadco-grey">
              Send your equipment list, part numbers or chemical specification.
              Include quantities, the delivery destination and any required documents
              so we can review your enquiry against a clear technical brief.
            </p>

            {reference ? (
              <div role="status" className="mt-8 rounded-md border border-neutral-300 bg-zadco-soft p-5">
                <p className="text-lg font-bold">RFQ received</p>
                <p className="mt-2 text-sm leading-6">Your reference is <strong>{reference}</strong>. Keep it for any follow-up with ZADCO.</p>
                <button type="button" className="mt-4 text-sm font-medium underline underline-offset-4" onClick={() => { requestId.current = null; setReference("") }}>Submit another enquiry</button>
              </div>
            ) : <form action="/api/rfq" method="post" encType="multipart/form-data" onSubmit={submitEnquiry} aria-busy={isSubmitting}>
            <fieldset disabled={isSubmitting} className="min-w-0">
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
              <ContactField name="fullName" placeholder="Enter your full name" autoComplete="name" />
              <ContactField name="company" placeholder="Enter your company name" autoComplete="organization" />
              <ContactField name="email" placeholder="name@company.com" autoComplete="email" />
              <ContactField name="phone" placeholder="Phone number with country code" autoComplete="tel" />
              <ContactField name="enquiryType" placeholder="Select enquiry type" dropdown defaultValue={selectedProduct ? "Request a Quote" : ""} options={rfqEnquiryTypes} />
              <ContactField name="product" placeholder="Enter product or category" defaultValue={selectedProduct} />
              <div className="sm:col-span-2">
                <details className="contact-mobile-brief lg:hidden">
                  <summary>What to include <ChevronDown size={18} aria-hidden="true" /></summary>
                  <SourcingBrief />
                </details>
                <ContactField name="requirements" placeholder="Part number or specification, application, quantity, delivery destination and date, required documents or inspection" large />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="rfq-attachments" className="mb-2 block text-sm font-medium">Attachments (optional)</label>
                <input id="rfq-attachments" name="attachments" type="file" multiple accept={rfqAttachmentTypes.join(",")} aria-describedby="rfq-attachment-help" className="block w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm" />
                <p id="rfq-attachment-help" className="mt-2 text-sm text-zadco-grey">PDF, XLSX, PNG or JPEG. Up to five files, 4 MB total.</p>
              </div>
            </div>
            <div hidden><label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label></div>

            <button type="submit" disabled={rfqAvailability !== "ready"} className="site-button site-button--primary mt-8 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50">
              <span>{isSubmitting ? "SUBMITTING…" : "SUBMIT RFQ"}</span><ArrowRight size={18} aria-hidden="true" />
            </button>
            </fieldset>
            {rfqAvailability === "unavailable" && <p role="status" className="mt-3 text-sm leading-6 text-zadco-grey">Online RFQ submission is currently unavailable. Please try again later.</p>}
            {submissionError && <p role="alert" className="mt-3 text-sm font-medium leading-6 text-red-700">{submissionError}</p>}
            </form>}
          </div>

          <div className="col-span-1 lg:col-span-5 min-w-0 flex flex-col gap-5">
            <div className="contact-panel hidden rounded-lg border border-neutral-200 bg-white p-5 sm:p-7 xl:p-8 lg:block">
              <Label>YOUR SOURCING BRIEF</Label>
              <Heading className="site-heading--compact mt-4">What to include</Heading>
              <div className="mt-6"><SourcingBrief /></div>
            </div>
            {(companyProfile.legalName || companyProfile.location || companyProfile.phone || companyProfile.email) && <div className="contact-panel rounded-lg border border-neutral-200 bg-white p-5 sm:p-7 xl:p-8">
              <Label>CONTACT ZADCO</Label>
              <div className="mt-5 flex flex-col gap-5">
                {companyProfile.legalName && <p className="text-sm font-semibold">{companyProfile.legalName}</p>}
                {companyProfile.location && <ContactItem type="address" label="Location">{companyProfile.location}</ContactItem>}
                {companyProfile.phone && <ContactItem type="phone" label="Phone"><a href={`tel:${companyProfile.phone.replace(/[^+\d]/g, "")}`}>{companyProfile.phone}</a></ContactItem>}
                {companyProfile.email && <ContactItem type="email" label="Email"><a href={`mailto:${companyProfile.email}`}>{companyProfile.email}</a></ContactItem>}
              </div>
            </div>}

            {companyProfile.location && <OfficeMap />}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
