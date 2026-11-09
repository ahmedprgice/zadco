import { equipmentCategoryHref, findEquipmentProduct } from "./equipment-categories"
import { useRouteLocation } from "./route-location"
import EquipmentReferenceImage from "./EquipmentReferenceImage"
import { Action, Heading, Label, Placeholder, SiteFooter, SiteHeader, TextLink } from "./SiteComponents"

const productRfqFields: Partial<Record<string, string[]>> = {
  "well-construction-cementing-2": [
    "Required pumping rate and discharge pressure, including the operating point if known.",
    "Truck, trailer or skid mounting, plus the preferred power source.",
    "Mixing and recirculation requirements, including any equipment the unit needs to connect to.",
  ],
  "stimulation-acidizing-3": [
    "Acid type, concentration and maximum operating temperature.",
    "Required working capacity and any specified tank material or lining.",
    "Inlet, outlet and vent requirements, plus any containment or transport requirements.",
  ],
  "high-pressure-equipment-pump-consumables-7": [
    "Pump manufacturer and model, plus the fluid-end part number or nameplate photo if available.",
    "Plunger diameter, required working pressure and intended service fluid.",
    "Whether the quote should include a bare fluid end or an assembly with valves, seats and packing.",
  ],
  "well-intervention-workover-5": [
    "Coiled tubing outside diameter, wall thickness and grade if known.",
    "Preferred connector style and the tool-side connection or thread.",
    "Required tensile load and working pressure, plus the service environment.",
  ],
  "laboratory-testing-equipment-1": [
    "Applicable test method and the temperature and pressure ranges required by the test schedule.",
    "Data logging and report export requirements.",
    "Required calibration documentation and any sample cups, seals or spares to include.",
  ],
}

const quantityAndDelivery = "Quantity, required condition, delivery destination and target date."
const generalRfqFields = [
  "Manufacturer or part number, where required, and whether alternatives are acceptable.",
  "Dimensions, ratings, materials, applicable standards and intended use.",
  quantityAndDelivery,
  "Required datasheets, certificates, traceability or inspection scope.",
]

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
  const specificRfqFields = productRfqFields[product.id]
  const rfqFields = specificRfqFields ? [...specificRfqFields, quantityAndDelivery] : generalRfqFields
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
          <div><Heading>{specificRfqFields ? "What to include in your RFQ" : "Your technical brief"}</Heading>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-zadco-grey marker:text-zadco-orange">
              {rfqFields.map((field) => <li key={field}>{field}</li>)}
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
