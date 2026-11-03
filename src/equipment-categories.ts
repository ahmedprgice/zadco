export const equipmentCategories = [
  { id: "drilling-services", label: "Drilling Equipment & Tools", items: ["Land and offshore drilling / workover rigs", "Drilling fluids and mud-related products", "Drill bits and drilling tools"] },
  { id: "well-construction-cementing", label: "Well Construction & Cementing", items: ["Casing and tubing", "Cementing equipment", "Wellhead installation equipment & tools", "Liner hangers and completion equipment & tools"] },
  { id: "well-completion-stimulation", label: "Well Completion & Stimulation", items: ["Packers and completion tools", "Slickline units & tools"] },
  { id: "well-testing-evaluation", label: "Well Testing & Evaluation", items: ["Pressure testing instruments", "Production testing tools"] },
  { id: "production-services", label: "Production Equipment & Chemicals", items: ["Artificial lift: ESP, gas lift and rod pumps", "Flow assurance instruments", "Production chemicals", "Well monitoring and metering instruments"] },
  { id: "well-intervention-workover", label: "Well Intervention & Workover Equipment", items: ["Coiled-tubing equipment", "Slickline units and tools", "Workover rigs"] },
  { id: "oilfield-equipment-maintenance", label: "General Oilfield Equipment", items: ["Pumps and compressors", "Separators", "Wellheads and Christmas trees", "Valves and flow-control equipment"] },
  { id: "data-acquisition", label: "Data & Real-Time Acquisition Systems", items: ["Acquisition systems for mud logging units", "Acquisition systems for cementing equipment", "Acquisition systems for coiled-tubing equipment"] },
  { id: "spare-parts-industrial-tools", label: "Spare Parts & Industrial Tools", items: ["Machinery spare parts and accessories", "Industrial and maintenance tools", "Oilfield instrumentation"] },
]

export function equipmentCategoryHref(id = "") {
  return `/equipment-tools${id ? `?category=${encodeURIComponent(id)}` : ""}#catalogue`
}

export type EquipmentReferencePhoto = {
  src: string
  alt: string
}

const workoverRigPhoto: EquipmentReferencePhoto = {
  src: "/images/equipment-illustrations/workover-rig.svg",
  alt: "Original schematic illustration of a generic land workover rig",
}

// Reference equipment illustrates only the matching part of each broad category.
const referencePhotos: Record<string, EquipmentReferencePhoto | undefined> = {
  "drilling-services-1": workoverRigPhoto,
  "well-intervention-workover-3": workoverRigPhoto,
  "oilfield-equipment-maintenance-1": {
    src: "/images/equipment-illustrations/mud-pump.svg",
    alt: "Original schematic illustration of a generic skid-mounted mud pump",
  },
  "well-construction-cementing-3": {
    src: "/images/equipment-illustrations/wellhead-spool.svg",
    alt: "Original schematic illustration of a generic flanged wellhead spacer spool",
  },
}

const productDescriptions: Record<string, string> = {
  "drilling-services-1": "Source land and offshore drilling or workover rigs against your application, operating requirements and technical specification. Request supply options from ZADCO.",
  "drilling-services-2": "Source drilling fluids and mud-related products for your drilling application. Specify the formulation, operating conditions, quantity and required documentation.",
  "drilling-services-3": "Source drill bits and drilling tools against your formation, bit type, diameter and connection requirements. Send your technical brief to ZADCO for review.",
  "well-construction-cementing-1": "Source casing and tubing for well construction. Provide the diameter, grade, connection, length and required quantity to define your sourcing enquiry.",
  "well-construction-cementing-2": "Source cementing equipment against your well construction specification. Include operating requirements, equipment compatibility and delivery needs in your brief.",
  "well-construction-cementing-3": "Source wellhead installation equipment and tools. Share connection details, operating requirements and compatibility specifications for sourcing review.",
  "well-construction-cementing-4": "Source liner hangers and completion equipment for well construction. Specify dimensions, operating conditions and compatibility requirements in your enquiry.",
  "well-completion-stimulation-1": "Source packers and completion tools against well specifications and operating conditions. Include required dimensions, materials and connection details.",
  "well-completion-stimulation-2": "Source slickline units and associated tools for well completion. Define the intended application, technical specification and required equipment scope.",
  "well-testing-evaluation-1": "Source pressure-testing instruments for well evaluation. Specify the operating pressure, application, measurement requirements and supporting documents.",
  "well-testing-evaluation-2": "Source production-testing tools and related measurement equipment. Share the operating conditions, required specifications and delivery destination.",
  "production-services-1": "Source artificial-lift equipment, including ESPs, gas-lift equipment and rod pumps. Submit operating conditions and specifications for a sourcing quotation.",
  "production-services-2": "Source flow-assurance instruments for oil and gas production. Share your process application, operating conditions and required measurement specifications.",
  "production-services-3": "Source production chemicals for your oil and gas process. Specify the application, product grade, concentration, quantity and required safety documents.",
  "production-services-4": "Source well-monitoring and metering instruments. Define operating conditions, measurement requirements and equipment compatibility in your technical brief.",
  "well-intervention-workover-1": "Source coiled-tubing equipment for well-servicing and intervention applications. Include operating conditions, equipment specifications and delivery needs.",
  "well-intervention-workover-2": "Source slickline units and tools for well intervention. Provide the application, operating conditions and technical specifications for product selection.",
  "well-intervention-workover-3": "Source workover rigs for well-servicing applications. Submit your operating requirements, technical specification and delivery needs to ZADCO.",
  "oilfield-equipment-maintenance-1": "Source pumps and compressors for production, processing and maintenance. Specify capacity, operating pressure, materials and connection requirements.",
  "oilfield-equipment-maintenance-2": "Source separators for oilfield production and processing. Provide capacity, operating pressure, material and connection specifications for your enquiry.",
  "oilfield-equipment-maintenance-3": "Source wellheads and Christmas trees against your operating pressure, materials and connection specifications. Include manufacturer or model details where required.",
  "oilfield-equipment-maintenance-4": "Source valves and flow-control equipment for oilfield applications. Include pressure rating, materials, connection details and the intended operating conditions.",
  "data-acquisition-1": "Source data and real-time acquisition systems for mud logging units. Share the equipment specification, intended application and required system compatibility.",
  "data-acquisition-2": "Source data and real-time acquisition systems for cementing equipment. Define the equipment specification, operating conditions and system requirements.",
  "data-acquisition-3": "Source data and real-time acquisition systems for coiled-tubing equipment. Submit the equipment specification and system compatibility requirements.",
  "spare-parts-industrial-tools-1": "Source machinery spare parts, replacement components and accessories. Provide manufacturer, model, part numbers and quantities wherever available.",
  "spare-parts-industrial-tools-2": "Source specialised industrial and maintenance tools for oilfield operations and projects. Send the tool specification, application and required quantity.",
  "spare-parts-industrial-tools-3": "Source oilfield instrumentation against your measurement and operating requirements. Include technical specifications, part numbers and required documentation.",
}

export const equipmentProducts = equipmentCategories.flatMap((category) =>
  category.items.map((title, index) => ({
    id: `${category.id}-${index + 1}`,
    categoryId: category.id,
    category: category.label,
    title,
    description: productDescriptions[`${category.id}-${index + 1}`],
    referencePhoto: referencePhotos[`${category.id}-${index + 1}`],
  })),
)

export function filterEquipmentProducts(categoryId: string, search = "", sort = "default") {
  const query = search.trim().toLowerCase()
  const products = equipmentProducts.filter((product) =>
    (!categoryId || product.categoryId === categoryId) &&
    (!query || `${product.title} ${product.category}`.toLowerCase().includes(query)),
  )
  if (sort === "az") products.sort((a, b) => a.title.localeCompare(b.title))
  if (sort === "za") products.sort((a, b) => b.title.localeCompare(a.title))
  return products
}

export function findEquipmentProduct(id: string) {
  const legacyIds: Record<string, string> = { "1": "drilling-services-3", "2": "well-construction-cementing-1", "3": "oilfield-equipment-maintenance-3" }
  return equipmentProducts.find(product => product.id === (legacyIds[id] ?? id))
}
