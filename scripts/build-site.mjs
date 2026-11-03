import { build, createServer } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, parseFragment, serialize } from "parse5";

const indexable = process.argv.includes("--indexable");
await build({ configLoader: "runner" });
const template = await readFile("dist/index.html", "utf8");
const server = await createServer({ configLoader: "runner", optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: "custom" });

function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.childNodes ?? []) {
    const result = find(child, predicate);
    if (result) return result;
  }
}
const attribute = (node, name) => node.attrs?.find(attr => attr.name === name)?.value;
const setAttribute = (node, name, value) => {
  node.attrs = node.attrs.filter(attr => attr.name !== name);
  node.attrs.push({ name, value });
};
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const appendHtml = (node, html) => {
  for (const child of parseFragment(html).childNodes) {
    child.parentNode = node;
    node.childNodes.push(child);
  }
};

try {
  const { renderPage, getPageSeo, sitemapPaths, siteOrigin } = await server.ssrLoadModule("/src/entry-server.tsx");
  const origin = new URL(process.env.SITE_URL || siteOrigin).origin;
  if (indexable && !origin.startsWith("https://")) throw new Error("Production SITE_URL must use HTTPS.");
  for (const pathname of [...sitemapPaths, "/404"]) {
    const seo = getPageSeo(pathname, { origin, indexable });
    const document = parse(template);
    const html = find(document, node => node.tagName === "html");
    setAttribute(html, "lang", "en");
    setAttribute(html, "data-indexable", String(indexable));
    setAttribute(html, "data-site-origin", origin);
    const head = find(document, node => node.tagName === "head");
    head.childNodes = head.childNodes.filter(node => {
      if (node.tagName === "title") return false;
      if (node.tagName === "link" && attribute(node, "rel") === "canonical") return false;
      if (node.tagName === "meta") {
        const name = attribute(node, "name") ?? attribute(node, "property") ?? "";
        return !["description", "robots"].includes(name) && !name.startsWith("og:") && !name.startsWith("twitter:");
      }
      return attribute(node, "id") !== "site-structured-data";
    });
    const meta = (key, value, attributeName = "name") => `<meta ${attributeName}="${key}" content="${escape(value)}">`;
    appendHtml(head, `<title>${escape(seo.title)}</title>${meta("description", seo.description)}${meta("robots", seo.robots)}<link rel="canonical" href="${escape(seo.canonical)}">`);
    for (const [key, value] of Object.entries({ title: seo.title, description: seo.description, url: seo.canonical, image: seo.image, type: "website", site_name: "ZADCO Oilfield Trading", locale: "en_US" })) appendHtml(head, meta(`og:${key}`, value, "property"));
    for (const [key, value] of Object.entries({ card: "summary_large_image", title: seo.title, description: seo.description, image: seo.image })) appendHtml(head, meta(`twitter:${key}`, value));
    appendHtml(head, `<script id="site-structured-data" type="application/ld+json">${JSON.stringify(seo.structuredData).replaceAll("<", "\\u003c")}</script>`);
    const root = find(document, node => attribute(node, "id") === "root");
    root.childNodes = [];
    appendHtml(root, renderPage(new URL(pathname, origin).href));
    const output = pathname === "/" ? "dist/index.html" : path.join("dist", `${pathname.slice(1)}.html`);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, serialize(document));
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapPaths.map(pathname => `<url><loc>${escape(new URL(pathname, origin).href)}</loc></url>`).join("")}</urlset>\n`;
  await writeFile("dist/sitemap.xml", sitemap);
  await writeFile("dist/robots.txt", indexable ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n");
  console.log(`Pre-rendered ${sitemapPaths.length} pages and a 404 page. Indexing ${indexable ? "enabled for production" : "blocked for preview"}.`);
} finally {
  await server.close();
}
