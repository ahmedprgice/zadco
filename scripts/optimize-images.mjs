import sharp from "sharp";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDir = "public/images";
const outputDir = `${sourceDir}/optimized`;
await mkdir(outputDir, { recursive: true });
const manifest = {};
let originalBytes = 0;
let optimizedBytes = 0;
for (const name of await readdir(sourceDir)) {
  if (!/\.(png|jpe?g)$/i.test(name) || name.includes("logo")) continue;
  const source = path.join(sourceDir, name);
  const metadata = await sharp(source).metadata();
  const widths = [...new Set([480, 800, 1280, 1920].map(width => Math.min(width, metadata.width)))];
  const variants = [];
  for (const width of widths) {
    const filename = `${path.parse(name).name}-${width}.webp`;
    const output = path.join(outputDir, filename);
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(output);
    variants.push({ src: `/images/optimized/${filename}`, width });
  }
  manifest[`/images/${name}`] = { width: metadata.width, height: metadata.height, variants };
  originalBytes += (await stat(source)).size;
  optimizedBytes += (await stat(`public${variants.at(-1).src}`)).size;
}
await writeFile("src/optimized-images.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ images: Object.keys(manifest).length, originalBytes, optimizedBytes, reduction: `${Math.round((1 - optimizedBytes / originalBytes) * 100)}%` }, null, 2));
