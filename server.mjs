import { createHash } from "node:crypto"
import { createReadStream } from "node:fs"
import { access, stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, join, normalize, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "dist")
const maxRequestBytes = 4_400_000
const rfqFields = {
  fullName: { label: "Full Name", maxLength: 120 },
  company: { label: "Company Name", maxLength: 160 },
  email: { label: "Email Address", maxLength: 254 },
  phone: { label: "Phone Number", maxLength: 60 },
  enquiryType: { label: "Enquiry Type", maxLength: 40 },
  product: { label: "Products / Equipment of Interest", maxLength: 500 },
  requirements: { label: "Your Message / Requirements", maxLength: 5000 },
}
const enquiryTypes = ["Request a Quote", "Sourcing Request", "General Enquiry"]
const attachmentTypes = [".pdf", ".xlsx", ".png", ".jpg", ".jpeg"]
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
const requestIdPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i

function error(message, status) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } })
}

function matchesFileType(extension, contents) {
  if (extension === ".pdf") return contents.subarray(0, 5).toString("ascii") === "%PDF-"
  if (extension === ".xlsx") return contents.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
  if (extension === ".png") return contents.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (extension === ".jpg" || extension === ".jpeg") return contents.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
  return false
}

async function handleRfq(request) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const sender = process.env.RFQ_FROM_EMAIL?.trim()
  const recipient = process.env.RFQ_TO_EMAIL?.trim()
  if (request.method === "GET") return Response.json({ available: Boolean(apiKey && sender && recipient) }, { headers: { "Cache-Control": "no-store" } })
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "GET, POST" } })
  const origin = request.headers.get("origin")
  if (origin) {
    const originHost = new URL(origin).hostname.replace(/^www\./, "")
    const requestHost = new URL(request.url).hostname.replace(/^www\./, "")
    if (originHost !== requestHost) return error("Submit your enquiry from the ZADCO contact page.", 403)
  }
  if (!apiKey || !sender || !recipient) return error("Online submission is currently unavailable. Please try again later.", 503)
  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.startsWith("multipart/form-data") || !request.body) return error("Please submit the RFQ form.", 400)
  if (Number(request.headers.get("content-length")) > maxRequestBytes) return error("Attachments must total 4 MB or less.", 413)
  let form
  try {
    form = await request.formData()
  } catch {
    return error("The form could not be read. Please try again.", 400)
  }
  const requestId = form.get("requestId")
  if (form.get("website") || typeof requestId !== "string" || !requestIdPattern.test(requestId)) return error("Please reload the form and try again.", 400)
  const fields = {}
  for (const [name, { label, maxLength }] of Object.entries(rfqFields)) {
    const value = form.get(name)
    if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) return error(`Please enter a valid value for ${label}.`, 400)
    fields[name] = value.trim()
  }
  if (!emailPattern.test(fields.email)) return error("Please enter a valid email address.", 400)
  if (!enquiryTypes.includes(fields.enquiryType)) return error("Please select a valid enquiry type.", 400)
  const files = form.getAll("attachments").filter(file => typeof file !== "string" && file?.size)
  if (files.length > 5) return error("Attach up to 5 files.", 400)
  const attachments = []
  let attachmentBytes = 0
  for (const file of files) {
    attachmentBytes += file.size
    if (attachmentBytes > 4 * 1024 * 1024) return error("Attachments must total 4 MB or less.", 413)
    const filename = file.name.replace(/[^a-zA-Z0-9._ -]/g, "_").trim()
    const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase()
    if (filename.length > 180 || !attachmentTypes.includes(extension)) return error("Attach PDF, XLSX, PNG or JPEG files with a valid filename.", 400)
    const contents = Buffer.from(await file.arrayBuffer())
    if (!matchesFileType(extension, contents)) return error("An attachment does not match its file type.", 400)
    attachments.push({ filename, content: contents.toString("base64") })
  }
  const details = Object.entries(rfqFields).map(([name, { label }]) => `${label}: ${fields[name]}`).join("\n\n")
  const submissionKey = createHash("sha256").update(JSON.stringify({ requestId, details, attachments })).digest("hex")
  const reference = `RFQ-${submissionKey.slice(0, 12).toUpperCase()}`
  try {
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `zadco-rfq/${submissionKey}` },
      body: JSON.stringify({ from: sender, to: [recipient], reply_to: fields.email, subject: `ZADCO enquiry ${reference}`, text: `Reference: ${reference}\n\n${details}`, attachments }),
      signal: AbortSignal.timeout(10000),
    })
    if (!delivery.ok) return error("We couldn’t accept your enquiry. Please try again later.", 502)
  } catch {
    return error("We couldn’t confirm your submission. Please try again later.", 502)
  }
  return Response.json({ reference }, { headers: { "Cache-Control": "no-store" } })
}

const types = { ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".pdf": "application/pdf", ".xml": "application/xml", ".txt": "text/plain" }
async function staticFile(pathname) {
  const clean = decodeURIComponent(pathname.split("?")[0]).replace(/^\/+/, "")
  const candidates = [clean, join(clean, "index.html"), `${clean}.html`, clean === "" ? "index.html" : "404.html"]
  for (const relative of candidates) {
    const file = normalize(join(root, relative))
    if (!file.startsWith(root)) continue
    try { if ((await stat(file)).isFile()) return file } catch {}
  }
  return join(root, "404.html")
}

const server = createServer(async (incoming, response) => {
  try {
    const url = new URL(incoming.url || "/", `http://${incoming.headers.host || "localhost"}`)
    if (url.pathname === "/api/rfq") {
      const request = new Request(url, { method: incoming.method, headers: incoming.headers, body: incoming.method === "GET" || incoming.method === "HEAD" ? undefined : incoming, duplex: "half" })
      const result = await handleRfq(request)
      response.writeHead(result.status, Object.fromEntries(result.headers))
      response.end(Buffer.from(await result.arrayBuffer()))
      return
    }
    const file = await staticFile(url.pathname)
    response.writeHead(200, { "Content-Type": types[extname(file)] || "text/html; charset=utf-8" })
    createReadStream(file).pipe(response)
  } catch (cause) {
    console.error(cause)
    response.writeHead(500, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ error: "Internal server error" }))
  }
})

const port = Number(process.env.PORT || 3000)
server.listen(port, process.env.HOST || "0.0.0.0", () => console.log(`ZADCO server listening on port ${port}`))
