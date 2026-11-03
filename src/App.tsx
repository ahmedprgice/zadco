import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import EquipmentToolsPage from "./EquipmentToolsPage";
import HomePage from "./HomePage";
import PetrochemicalsPage from "./PetrochemicalsPage";
import ProductDetailPage from "./ProductDetailPage";
import { RouteLocation } from "./route-location";
import { applyPageSeo } from "./seo";
import { Heading, SiteHeader, SiteFooter, TextLink } from "./SiteComponents";

export default function App({ initialUrl }: { initialUrl?: string } = {}) {
  const [url, setUrl] = useState(() => initialUrl ?? window.location.href);
  useEffect(() => applyPageSeo(new URL(url)), [url]);
  useEffect(() => {
    const positions = new Map<string, number>();
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const savePosition = () => positions.set(window.location.href, window.scrollY);
    savePosition();

    const showPage = (destination: URL, restore?: number) => {
      const update = () => {
        flushSync(() => setUrl(destination.href));
        const heading = document.querySelector<HTMLElement>("h1");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
        let target: HTMLElement | null = null;
        try { target = document.getElementById(decodeURIComponent(destination.hash.slice(1))); } catch { /* Ignore malformed fragment identifiers. */ }
        if (restore !== undefined) window.scrollTo({ top: restore, behavior: "instant" });
        else if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
        else window.scrollTo({ top: 0, behavior: "instant" });
      };
      const transitionDocument = document as Document & { startViewTransition?: (callback: () => void) => { finished: Promise<void> } };
      if (transitionDocument.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        transitionDocument.startViewTransition(update).finished.catch(() => {});
      } else update();
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href);
      if (destination.origin !== location.origin || !/^\/(?:about|contact|petrochemicals|equipment-tools(?:\/product\/[^/]+)?)?\/?$/.test(destination.pathname)) return;
      // Let native fragment links scroll without remounting the current page.
      if (destination.pathname === location.pathname && destination.search === location.search) return;
      event.preventDefault();
      savePosition();
      history.pushState(null, "", destination);
      showPage(destination);
    };
    const onBack = () => showPage(new URL(location.href), positions.get(location.href) ?? 0);
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onBack);
    window.addEventListener("scroll", savePosition, { passive: true });
    return () => {
      history.scrollRestoration = previousRestoration;
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onBack);
      window.removeEventListener("scroll", savePosition);
    };
  }, []);

  return <SitePage key={url} url={new URL(url)} />;
}

export function SitePage({ url }: { url: URL }) {
  return <RouteLocation.Provider value={url}><Page path={url.pathname.replace(/\/+$/, "") || "/"} /></RouteLocation.Provider>;
}

function Page({ path }: { path: string }) {

  if (/^\/equipment-tools\/product\/[^/]+$/.test(path)) return <ProductDetailPage />;
  if (path === "/equipment-tools") return <EquipmentToolsPage />;
  if (path === "/petrochemicals") return <PetrochemicalsPage />;
  if (path === "/about") return <AboutPage />;
  if (path === "/contact") return <ContactPage />;

  if (path === "/") return <HomePage />;
  return <main><SiteHeader active="" /><section className="site-section"><div className="mx-auto max-w-7xl px-4 sm:px-6"><Heading level={1}>Page not found</Heading><p className="my-6 text-zadco-grey">This page is not available. Explore our equipment range or return to the homepage.</p><TextLink path="/">BACK TO HOME</TextLink></div></section><SiteFooter /></main>;
}
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
