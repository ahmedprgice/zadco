import { companyProfile } from "./company-profile"
import { equipmentProducts, findEquipmentProduct } from "./equipment-categories"

export const siteOrigin = "https://www.zadco.ae"
export const mainPaths = ["/", "/about", "/equipment-tools", "/petrochemicals", "/contact"]
export const sitemapPaths = [...mainPaths, ...equipmentProducts.map(product => `/equipment-tools/product/${product.id}`)]

const pages: Record<string, { title: string; description: string; name: string }> = {
  "/": {
    title: "Oilfield Equipment, Tools & Petrochemical Supply | ZADCO",
    description: "Source oilfield equipment, industrial tools, spare parts and petrochemicals with ZADCO. Send your specifications, quantities and delivery requirements.",
    name: "Oilfield equipment, tools and petrochemical supply",
  },
  "/about": {
    title: "About ZADCO | Oilfield Equipment Trading & Supply",
    description: "Meet ZADCO Oilfield Trading LLC. Learn about our sourcing approach, mission and commitment to supplying oilfield equipment, tools and petrochemicals.",
    name: "About ZADCO Oilfield Trading",
  },
  "/equipment-tools": {
    title: "Oilfield Equipment & Industrial Tools Sourcing | ZADCO",
    description: "Explore drilling, completion, production and well intervention equipment, industrial tools and spare parts. Request sourcing options against your technical brief.",
    name: "Oilfield equipment and industrial tools",
  },
  "/petrochemicals": {
    title: "Petrochemicals, Production Chemicals & Lubricants | ZADCO",
    description: "Source production chemicals, drilling fluids, flow-assurance products, lubricants and industrial fluids. Specify your application, grade and quantity.",
    name: "Petrochemicals and production chemicals",
  },
  "/contact": {
    title: "Request an Oilfield Equipment or Chemical Quote | ZADCO",
    description: "Send ZADCO your equipment list, part numbers or chemical specification. Include quantities, delivery requirements and documents to request a sourcing quotation.",
    name: "Request a sourcing quotation",
  },
}

export function getPageSeo(input: URL | string, options: { origin?: string; indexable?: boolean } = {}) {
  const origin = new URL(options.origin ?? siteOrigin).origin
  const url = new URL(input, origin)
  const path = url.pathname.replace(/\/+$/, "") || "/"
  const productMatch = path.match(/^\/equipment-tools\/product\/([^/]+)$/)
  const product = productMatch ? findEquipmentProduct(productMatch[1]) : undefined
  const page = product ? { title: `${product.title} Sourcing | ZADCO`, description: product.description, name: product.title } : pages[path]
  const status = page ? 200 : 404
  const canonicalPath = product ? `/equipment-tools/product/${product.id}` : page ? path : "/404"
  const canonical = new URL(canonicalPath, origin).href
  const title = page?.title ?? "Page Not Found | ZADCO"
  const description = page?.description ?? "This page is not available. Explore ZADCO's oilfield equipment, tools and petrochemical sourcing range."
  const robots = options.indexable && status === 200 && !url.search ? "index, follow, max-image-preview:large" : "noindex, follow"
  const organizationId = `${origin}/#organization`
  const graph: Record<string, unknown>[] = [
    { "@type": "Organization", "@id": organizationId, name: companyProfile.legalName, url: `${origin}/`, logo: `${origin}/images/zadco-oilfield-trading-logo.png`, email: companyProfile.email, description: "Oilfield equipment, industrial tools, spare parts and petrochemical trading and supply." },
    { "@type": "WebSite", "@id": `${origin}/#website`, url: `${origin}/`, name: "ZADCO Oilfield Trading", publisher: { "@id": organizationId }, inLanguage: "en" },
    { "@type": path === "/about" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: page?.name ?? "Page not found", description, isPartOf: { "@id": `${origin}/#website` }, inLanguage: "en" },
  ]
  if (page && path !== "/") {
    const crumbs = [{ name: "Home", item: `${origin}/` }]
    if (product) crumbs.push({ name: "Equipment & Tools", item: `${origin}/equipment-tools` })
    crumbs.push({ name: page.name, item: canonical })
    graph.push({ "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb })) })
  }
  return { title, description, canonical, robots, status, image: `${origin}/images/home-offshore-hero.png`, structuredData: { "@context": "https://schema.org", "@graph": graph } }
}

export function applyPageSeo(url: URL) {
  const seo = getPageSeo(url, { origin: document.documentElement.dataset.siteOrigin ?? siteOrigin, indexable: document.documentElement.dataset.indexable === "true" })
  document.title = seo.title
  document.documentElement.lang = "en"
  const meta = (attribute: "name" | "property", key: string, content: string) => {
    const matches = [...document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`)]
    const element = matches.shift() ?? document.createElement("meta")
    matches.forEach(duplicate => duplicate.remove())
    element.setAttribute(attribute, key)
    element.content = content
    document.head.append(element)
  }
  meta("name", "description", seo.description)
  meta("name", "robots", seo.robots)
  for (const [key, value] of Object.entries({ title: seo.title, description: seo.description, url: seo.canonical, image: seo.image, type: "website", site_name: "ZADCO Oilfield Trading", locale: "en_US" })) meta("property", `og:${key}`, value)
  for (const [key, value] of Object.entries({ card: "summary_large_image", title: seo.title, description: seo.description, image: seo.image })) meta("name", `twitter:${key}`, value)
  const canonicals = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')]
  const canonical = canonicals.shift() ?? document.createElement("link")
  canonicals.forEach(duplicate => duplicate.remove())
  canonical.rel = "canonical"
  canonical.href = seo.canonical
  document.head.append(canonical)
  const schema = document.getElementById("site-structured-data") ?? document.createElement("script")
  schema.id = "site-structured-data"
  schema.setAttribute("type", "application/ld+json")
  schema.textContent = JSON.stringify(seo.structuredData)
  document.head.append(schema)
}
