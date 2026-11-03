import {
  Action,
  Heading,
  Label,
  Placeholder,
  SiteFooter,
  SiteHeader,
} from "./SiteComponents"

export default function PetrochemicalsPage() {
  return (
    <main className="min-w-0 bg-white text-neutral-950">
      <SiteHeader active="Equipment & Tools" />
      <section className="site-section industrial-surface industrial-arcs-corner bg-zadco-soft">
        <div className="industrial-content mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12 items-center gap-6 px-4 sm:px-6">
          <div className="col-span-1 lg:col-span-6">
            <Label>PETROCHEMICAL PRODUCTS</Label>
            <Heading
              level={1}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl"
            >
              Petrochemicals &amp; Production Chemicals
            </Heading>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              We source petrochemicals and chemical products for drilling, production,
              maintenance and industrial applications. Each enquiry is reviewed according
              to the intended application, product grade, quantity, packaging and delivery
              requirements. Required safety, technical and certification documents can be
              confirmed during sourcing.
            </p>
            <div className="mt-9">
              <Action path="/contact#rfq">SEND A REQUIREMENT</Action>
            </div>
          </div>
          <Placeholder
            label="INDUSTRIAL IMAGE"
            className="site-editorial-image col-span-1 lg:col-span-5 lg:col-start-8"
          />
        </div>
      </section>
      <section className="site-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Label>PRODUCT CATEGORIES</Label>
          <Heading className="mt-5 text-3xl sm:text-4xl">
            Chemicals, Lubricants & Industrial Fluids
          </Heading>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zadco-grey">Include the product specification, quantity, packaging and destination in your enquiry. Note any required safety data sheet, certificate of analysis or handling conditions so the complete supply scope can be reviewed.</p>
          <div className="mt-10 grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {[
              ["Production Chemicals", "Chemicals specified for oil and gas production. Product selection starts with the process application, required grade and concentration."],
              ["Drilling Fluids & Additives", "Drilling fluids, additives and mud-related products sourced against the drilling application, technical specifications and operating requirements."],
              ["Flow-Assurance Products", "Flow-assurance products for production applications, reviewed against operating conditions, intended use and technical specifications."],
              ["Industrial Chemicals", "Chemicals for operating and maintenance applications. Define the composition, purity and intended use to guide selection."],
              ["Petrochemical Products", "Petrochemical sourcing based on product identity and grade. A product name or CAS number helps establish the precise specification."],
              ["Lubricants", "Lubricants for oilfield machinery and industrial equipment. Selection is guided by viscosity, operating conditions and equipment approvals."],
              ["Industrial Fluids", "Fluids for equipment operation and maintenance. Specify the application, fluid properties and equipment compatibility requirements."],
            ].map(([item, copy]) => (
              <article
                key={item}
                className="border-t border-neutral-300 py-8"
              >
                <Heading level={3} className="text-2xl">
                  {item}
                </Heading>
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  {copy}
                </p>
                <a href={`/contact?product=${encodeURIComponent(item)}#rfq`} className="site-text-link mt-5 inline-flex">SEND A REQUIREMENT</a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
