import { ArrowRight } from "lucide-react"
import { equipmentCategoryHref } from "./equipment-categories"

const priorityGroups = [
  {
    id: "well-construction-cementing",
    title: "Cementing Equipment & Materials",
    description: "Cementing units, batch mixers, cement heads, float equipment, oilwell cement and additives.",
  },
  {
    id: "stimulation-acidizing",
    title: "Stimulation & Acidizing",
    description: "Pumping and mixing equipment, acid-compatible tanks, treatment acids and corrosion inhibitors.",
  },
  {
    id: "high-pressure-equipment-pump-consumables",
    title: "High-Pressure Equipment & Pump Components",
    description: "Treating iron, manifolds, pressure-rated hoses, fluid ends, plungers and packing.",
  },
  {
    id: "well-intervention-workover",
    title: "Coiled Tubing & Downhole Tools",
    description: "Coiled tubing strings and connectors, pressure-control equipment and spares, and fishing tools.",
  },
  {
    id: "laboratory-testing-equipment",
    title: "Laboratory Testing Equipment",
    description: "Cement consistometers, ultrasonic cement analyzers, rheometers and fluid-loss testing equipment.",
  },
]

export default function PriorityProductGroups() {
  return (
    <section id="priority-product-groups" aria-labelledby="priority-product-groups-title" className="scroll-mt-28 border-y border-zadco-grey/20 bg-zadco-soft py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="priority-product-groups-title" className="site-heading font-condensed font-bold text-zadco-navy">Featured Supply Categories</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-6 xl:grid-cols-5">
          {priorityGroups.map(({ id, title, description }) => (
            <li key={id} className="md:col-span-2 md:nth-[n+4]:col-span-3 xl:col-span-1 xl:nth-[n+4]:col-span-1">
              <a href={equipmentCategoryHref(id)} className="flex h-full flex-col gap-2 border border-zadco-grey/25 border-t-2 border-t-zadco-orange bg-white p-4 text-zadco-navy hover:border-zadco-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zadco-navy">
                <span className="flex items-start justify-between gap-3 font-semibold">
                  {title}
                  <ArrowRight size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-zadco-orange" />
                </span>
                <span className="text-sm leading-5 text-zadco-grey">{description}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
