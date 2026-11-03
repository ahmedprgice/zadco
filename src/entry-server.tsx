import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import App from "./App"
export { getPageSeo, sitemapPaths, siteOrigin } from "./seo"

export function renderPage(url: string) {
  return renderToString(<StrictMode><App initialUrl={url} /></StrictMode>)
}
