import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createServer } from "vite";
import { parse } from "parse5";

const all = (node, predicate) => [...(predicate(node) ? [node] : []), ...(node.childNodes ?? []).flatMap(child => all(child, predicate))];
const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
const text = node => node.value ?? (node.childNodes ?? []).map(text).join("");
const server = await createServer({ configLoader: "runner", optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: "custom" });
try {
  const { getPageSeo, sitemapPaths, renderPage } = await server.ssrLoadModule("/src/entry-server.tsx");
  const titles = new Set();
  const descriptions = new Set();
  let indexable;
  for (const pathname of [...sitemapPaths, "/404"]) {
    const file = pathname === "/" ? "dist/index.html" : `dist${pathname}.html`;
    const document = parse(await readFile(file, "utf8"));
    const html = all(document, node => node.tagName === "html")[0];
    indexable = attr(html, "data-indexable") === "true";
    assert.equal(attr(html, "lang"), "en");
    const seo = getPageSeo(pathname, { origin: attr(html, "data-site-origin"), indexable });
    const getMeta = key => all(document, node => node.tagName === "meta" && (attr(node, "name") === key || attr(node, "property") === key));
    const pageTitles = all(document, node => node.tagName === "title");
    assert.equal(pageTitles.length, 1, `${pathname}: duplicate title`);
    assert.equal(text(pageTitles[0]), seo.title);
    assert.equal(getMeta("description").length, 1);
    assert.equal(attr(getMeta("description")[0], "content"), seo.description);
    assert.equal(getMeta("robots").length, 1);
    assert.equal(attr(getMeta("robots")[0], "content"), seo.robots);
    assert.equal(getMeta("og:title").length, 1);
    assert.equal(attr(getMeta("og:url")[0], "content"), seo.canonical);
    const canonicals = all(document, node => node.tagName === "link" && attr(node, "rel") === "canonical");
    assert.equal(canonicals.length, 1);
    assert.equal(attr(canonicals[0], "href"), seo.canonical);
    assert.equal(all(document, node => node.tagName === "h1").length, 1, `${pathname}: expected one H1`);
    assert.ok(text(all(document, node => attr(node, "id") === "root")[0]).length > 500, `${pathname}: empty app shell`);
    const graph = JSON.parse(text(all(document, node => attr(node, "id") === "site-structured-data")[0]));
    assert.equal(graph["@context"], "https://schema.org");
    assert.ok(graph["@graph"].some(node => node["@type"] === "Organization"));
    assert.ok(!graph["@graph"].some(node => node["@type"] === "Product" || node.aggregateRating || node.address));
    if (pathname !== "/404") {
      assert.ok(!titles.has(seo.title), `${pathname}: duplicate title`);
      assert.ok(!descriptions.has(seo.description), `${pathname}: duplicate description`);
      titles.add(seo.title);
      descriptions.add(seo.description);
    }
  }
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, sitemapPaths.length);
  assert.ok([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].every(([, location]) => !new URL(location).search));
  const robots = await readFile("dist/robots.txt", "utf8");
  assert.ok(robots.includes(indexable ? "Allow: /" : "Disallow: /"));
  assert.equal(getPageSeo("/missing", { indexable: true }).status, 404);
  assert.equal(getPageSeo("/equipment-tools/product/extra/drilling-services-3", { indexable: true }).status, 404);
  assert.ok(getPageSeo("/equipment-tools/product/missing", { indexable: true }).robots.includes("noindex"));
  assert.ok(getPageSeo("/contact?product=Pumps", { indexable: true }).robots.includes("noindex"));
  assert.ok(getPageSeo("/equipment-tools?q=rig", { indexable: true }).robots.includes("noindex"));
  assert.equal(getPageSeo("/about/", { indexable: true }).canonical, getPageSeo("/about", { indexable: true }).canonical);
  assert.equal(getPageSeo("/equipment-tools/product/1").canonical, getPageSeo("/equipment-tools/product/drilling-services-3").canonical);
  assert.ok(renderPage("https://www.zadco.ae/contact?product=Example%20pump").includes('value="Example pump"'));
  assert.ok(renderPage("https://www.zadco.ae/equipment-tools?category=data-acquisition").includes("Acquisition systems for mud logging units"));
  await access("public/images/zadco-oilfield-trading-logo.png");
  await access("public/images/home-offshore-hero.png");
  console.log(`PASS: ${sitemapPaths.length} pre-rendered pages, unique metadata, one H1 per page, schemas, sitemap, ${indexable ? "production" : "preview"} robots, canonical aliases, query filtering and quote prefilling.`);
} finally {
  await server.close();
}
