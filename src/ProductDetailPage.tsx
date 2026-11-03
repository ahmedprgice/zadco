import { equipmentCategoryHref, findEquipmentProduct } from "./equipment-categories"
import { useRouteLocation } from "./route-location"
import EquipmentReferenceImage from "./EquipmentReferenceImage"
import { Action, Heading, Label, Placeholder, SiteFooter, SiteHeader, TextLink } from "./SiteComponents"

export default function ProductDetailPage() {
  const productId = useRouteLocation().pathname.split("/").filter(Boolean).at(-1)
  const product = findEquipmentProduct(productId ?? "")
  if (!product) return <main className="min-w-0 bg-white text-zadco-navy">
    <SiteHeader active="Equipment & Tools" />
    <section className="site-section"><div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Heading level={1}>Equipment not found</Heading>
      <p className="my-6 text-zadco-grey">Browse the sourcing categories or send a specific requirement.</p>
      <TextLink path="/equipment-tools">BACK TO EQUIPMENT</TextLink>
    </div></section><SiteFooter />
  </main>

  const enquiry = `/contact?product=${encodeURIComponent(product.title)}#rfq`
  return <main className="min-w-0 bg-white text-zadco-navy">
    <SiteHeader active="Equipment & Tools" />
    <section className="site-section industrial-surface industrial-arcs-corner">
      <div className="industrial-content mx-auto max-w-7xl px-4 sm:px-6">
        <TextLink path={equipmentCategoryHref(product.categoryId)}>BACK TO CATEGORY</TextLink>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {product.referencePhoto ? <EquipmentReferenceImage photo={product.referencePhoto} /> : <Placeholder label="SOURCING CATEGORY" className="site-product-image" />}
            <p className="mt-4 text-sm leading-6 text-zadco-grey">Equipment type shown for sourcing enquiries, not a live stock listing. Reference images are illustrative.</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Label>{product.category}</Label>
            <Heading level={1} className="mt-5">{product.title}</Heading>
            <p className="mt-5 text-base leading-7 text-zadco-grey">{product.description}</p>
            <dl className="mt-8 border-y border-neutral-200">
              {[["Category", product.category], ["Manufacturer / model", "Quoted to your brief"], ["Specifications / condition", "Defined for the proposed product"], ["Availability / lead time", "Confirmed in the quotation"]].map(([label, value]) => <div key={label} className="grid gap-2 border-b border-neutral-200 py-4 last:border-0 sm:grid-cols-2">
                <dt className="text-sm text-zadco-grey">{label}</dt><dd className="text-sm font-medium">{value}</dd>
              </div>)}
            </dl>
            <div className="mt-8"><Action path={enquiry}>REQUEST A QUOTE</Action></div>
          </div>
        </div>
        <div className="mt-12 grid gap-8 border-t border-neutral-300 pt-10 lg:grid-cols-2">
          <div><Heading>Your technical brief</Heading>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-zadco-grey marker:text-zadco-orange">
              <li>Manufacturer or part number, where required, and whether alternatives are acceptable.</li>
              <li>Dimensions, ratings, materials, applicable standards and intended use.</li>
              <li>Quantity, required condition, delivery destination and target date.</li>
              <li>Required datasheets, certificates, traceability or inspection scope.</li>
            </ul>
          </div>
          <div><Heading>Documentation & delivery</Heading>
            <p className="mt-5 text-base leading-7 text-zadco-grey">Include any datasheet, certificate or inspection requirement in your brief. Document availability and inspection scope depend on the product and supplier. Confirm these alongside lead time, packaging and delivery terms before ordering.</p>
            <div className="mt-5"><TextLink path={enquiry}>DISCUSS TECHNICAL REQUIREMENTS</TextLink></div>
          </div>
        </div>
      </div>
    </section><SiteFooter />
  </main>
}
