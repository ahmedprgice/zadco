import ResponsiveImage from "./ResponsiveImage";
import type { EquipmentReferencePhoto } from "./equipment-categories"

export default function EquipmentReferenceImage({ photo }: { photo: EquipmentReferencePhoto }) {
  return (
    <figure>
      <div className="site-product-image overflow-hidden border-b border-neutral-200 bg-neutral-100">
        <ResponsiveImage
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
      <figcaption className="border-b border-neutral-200 px-4 py-2 text-xs leading-5 text-zadco-grey">
        Reference photo | <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-zadco-orange focus-visible:outline-2 focus-visible:outline-zadco-orange"
        >MachineryTrader</a>
      </figcaption>
    </figure>
  )
}
