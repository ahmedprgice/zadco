# Image provenance review

Reviewed 2026-11-03. This records available evidence, not a legal clearance.

## Replacements

The three MachineryTrader JPGs were removed from the current source. They were initially replaced with original SVG schematics, and then replaced at the user's request with AI-generated equipment images. Older Git commits and older Vercel deployments can still contain the removed files.

- equipment-ai/workover-rig.webp
- equipment-ai/mud-pump.webp
- equipment-ai/wellhead-spool.webp

Generated on 2026-11-03 using the built-in OpenAI image-generation tool. Each image was generated separately from a written description, without input or reference photographs. The requests specified generic fictional equipment, no manufacturer model, no branding, no logos or text, a pale grey studio background, and navy/orange industrial finishes. Subjects: mobile land workover rig; skid-mounted triplex mud pump; flanged wellhead spacer spool. These are illustrative assets, not technical drawings or photographs of actual stock. The website labels them accordingly. Full-resolution generated PNGs remain in the local Codex generated-images folder; deployed versions are optimized 1200px WebP files.

AI generation records provide provenance for these three assets, not a guarantee of exclusive ownership or legal clearance. The older SVG alternatives remain in the repository but are no longer used by the pages.

## Existing local images

No license, attribution, original download record, or generation record was found for the following files. The raster originals contain no EXIF, IPTC or XMP metadata. Their appearance or filename does not prove ownership or AI generation. ZADCO logo ownership also needs confirmation from the company.

| File | Status |
| --- | --- |
| about-direction-drafting.svg | Source and usage rights unverified |
| about-roadmap-1280-reference.png | Source and usage rights unverified |
| about-roadmap-reference.png | Source and usage rights unverified |
| company-overview-pipelines.jpg | Source and usage rights unverified |
| company-overview-reference.png | Source and usage rights unverified |
| equipment-christmas-trees.png | Source and usage rights unverified |
| equipment-coiled-tubing.png | Source and usage rights unverified |
| equipment-compressors.png | Source and usage rights unverified |
| equipment-drill-bits.png | Source and usage rights unverified |
| equipment-pumps.png | Source and usage rights unverified |
| equipment-separators.png | Source and usage rights unverified |
| equipment-wellheads.png | Source and usage rights unverified |
| home-offshore-hero.png | Source and usage rights unverified |
| home-supply-reference.png | Source and usage rights unverified |
| industry-refinery.jpg | Source and usage rights unverified |
| offshore-rig-sunset.png | Source and usage rights unverified |
| sourcing-process-refinery.png | Source and usage rights unverified |
| supply-pipelines.jpg | Source and usage rights unverified |
| zadco-logo-colour.png | Company logo; ownership approval needed |
| zadco-logo-white.png | Company logo; ownership approval needed |
| zadco-oilfield-trading-logo-reversed.png | Company logo; ownership approval needed |
| zadco-oilfield-trading-logo.png | Company logo; ownership approval needed |
| zadco-primary-full-colour.png | Company logo; ownership approval needed |
| zadco-primary-full-reversed.png | Company logo; ownership approval needed |

Optimized WebP variants inherit the rights status of their source image; conversion does not establish permission.

## Unsplash links

EquipmentToolsPage.tsx uses one Unsplash CDN image for the hero. The standard Unsplash license permits commercial website use, subject to its terms: https://unsplash.com/license . The repository does not include the original photo page or download records establishing this image's provenance. Featured equipment uses the local AI-generated illustrations.

## Video

public/videos/zadco-introduction.mp4 is assembled by scripts/render-company-video.mjs from existing local images. Its source-image rights remain unverified. The poster requires the same review.

## Outstanding evidence

For remaining images, obtain the original source page and license/download receipt, written permission, company ownership approval, or original creation/generation record. Until then, do not describe the complete image set as copyright-cleared.

## Page-one catalogue additions

Ten more text-only AI-generated equipment illustrations were added on 2026-11-03 to fill every remaining placeholder on the default desktop first page (12 catalogue items). Subjects and generation method are recorded in public/images/equipment-ai/page-one-generation-record.json. No manufacturer photographs were supplied as references.

On 2026-11-09, 93 additional illustrations were generated individually with the built-in OpenAI image generation tool using written product descriptions. The optimized WebP files in `public/images/equipment-ai/` are named for their corresponding catalogue product IDs. All catalogue products now have an illustration, and the image alt text identifies it as AI generated.
