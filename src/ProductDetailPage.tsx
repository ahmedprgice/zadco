import { equipmentCategoryHref, findEquipmentProduct } from "./equipment-categories"
import { useRouteLocation } from "./route-location"
import EquipmentReferenceImage from "./EquipmentReferenceImage"
import { Action, Heading, Label, Placeholder, SiteFooter, SiteHeader, TextLink } from "./SiteComponents"

const productRfqDetails: Partial<Record<string, { summary: string; fields: string[] }>> = {
  "well-construction-cementing-2": {
    summary: "Pumping units for placing cement slurry during well construction.",
    fields: [
      "Required pumping rate and discharge pressure, including the operating point if known.",
      "Truck, trailer or skid mounting, plus the preferred power source.",
      "Mixing and recirculation requirements, including any equipment the unit needs to connect to.",
    ],
  },
  "stimulation-acidizing-3": {
    summary: "Storage tanks for acid used in well stimulation treatments.",
    fields: [
      "Acid type, concentration and maximum operating temperature.",
      "Required working capacity and any specified tank material or lining.",
      "Inlet, outlet and vent requirements, plus any containment or transport requirements.",
    ],
  },
  "high-pressure-equipment-pump-consumables-7": {
    summary: "Replacement fluid ends for high-pressure oilfield pumps.",
    fields: [
      "Pump manufacturer and model, plus the fluid-end part number or nameplate photo if available.",
      "Plunger diameter, required working pressure and intended service fluid.",
      "Whether the quote should include a bare fluid end or an assembly with valves, seats and packing.",
    ],
  },
  "well-intervention-workover-5": {
    summary: "Connectors that join a coiled tubing string to downhole tools.",
    fields: [
      "Coiled tubing outside diameter, wall thickness and grade if known.",
      "Preferred connector style and the tool-side connection or thread.",
      "Required tensile load and working pressure, plus the service environment.",
    ],
  },
  "laboratory-testing-equipment-1": {
    summary: "Laboratory instruments for measuring the thickening time of oilwell cement slurry.",
    fields: [
      "Applicable test method and the temperature and pressure ranges required by the test schedule.",
      "Data logging and report export requirements.",
      "Required calibration documentation and any sample cups, seals or spares to include.",
    ],
  },
}

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
  const rfqDetails = productRfqDetails[product.id]
  return <main className="min-w-0 bg-white text-zadco-navy">
    <SiteHeader active="Equipment & Tools" />
    <section className="site-section industrial-surface industrial-arcs-corner">
      <div className="industrial-content mx-auto max-w-7xl px-4 sm:px-6">
        <TextLink path={equipmentCategoryHref(product.categoryId)}>BACK TO CATEGORY</TextLink>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {product.referencePhoto ? <EquipmentReferenceImage photo={product.referencePhoto} /> : <Placeholder label="SOURCING CATEGORY" className="site-product-image" />}
            {product.referencePhoto && <p className="mt-4 text-sm leading-6 text-zadco-grey">Illustrative image.</p>}
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Label>{product.category}</Label>
            <Heading level={1} className="mt-5">{product.title}</Heading>
            {rfqDetails && <p className="mt-5 text-base leading-7 text-zadco-grey">{rfqDetails.summary}</p>}
            <div className="mt-8"><Action path={enquiry}>REQUEST A QUOTE</Action></div>
          </div>
        </div>
        <div className="mt-12 grid gap-8 border-t border-neutral-300 pt-10 lg:grid-cols-2">
          <div>
            <Heading>What to include in your RFQ</Heading>
            {rfqDetails ? (
              <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-zadco-grey marker:text-zadco-orange">
                {rfqDetails.fields.map((field) => <li key={field}>{field}</li>)}
                <li>Quantity, required condition, delivery destination and target date.</li>
              </ul>
            ) : (
              <p className="mt-5 text-base leading-7 text-zadco-grey">{product.description}</p>
            )}
          </div>
          <div>
            <Heading>What the quotation covers</Heading>
            <p className="mt-5 text-base leading-7 text-zadco-grey">The quotation identifies the proposed manufacturer, model, specification and condition. It also sets out availability, lead time, delivery terms and any agreed documentation or inspection scope.</p>
          </div>
        </div>
      </div>
    </section><SiteFooter />
  </main>
}
