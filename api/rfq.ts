import { createHash } from "node:crypto"
import { rfqAttachmentTypes, rfqEnquiryTypes, rfqFields, rfqMaxAttachments, rfqMaxAttachmentBytes } from "../src/rfq.js"

const maxRequestBytes = 4_400_000
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
const requestIdPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i

function error(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } })
}

function matchesFileType(extension: string, contents: Buffer) {
  switch (extension) {
    case ".pdf": return contents.subarray(0, 5).toString("ascii") === "%PDF-"
    case ".xlsx": return contents.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
    case ".png": return contents.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    case ".jpg":
    case ".jpeg": return contents.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
    default: return false
  }
}

export async function handleRfq(request: Request, env = process.env) {
  const apiKey = env.RESEND_API_KEY?.trim()
  const sender = env.RFQ_FROM_EMAIL?.trim()
  const recipient = env.RFQ_TO_EMAIL?.trim()
  if (request.method === "GET") {
    return Response.json({ available: Boolean(apiKey && sender && recipient) }, { headers: { "Cache-Control": "no-store" } })
  }
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "GET, POST" } })
  }
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

  let bytes = 0
  let tooLarge = false
  const limitedBody = request.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      bytes += chunk.byteLength
      if (bytes > maxRequestBytes) {
        tooLarge = true
        controller.error(new Error("RFQ payload too large"))
      } else {
        controller.enqueue(chunk)
      }
    },
  }))
  let form: FormData
  try {
    form = await new Response(limitedBody, { headers: { "Content-Type": contentType } }).formData()
  } catch {
    return tooLarge ? error("Attachments must total 4 MB or less.", 413) : error("The form could not be read. Please try again.", 400)
  }

  const requestId = form.get("requestId")
  if (form.get("website") || typeof requestId !== "string" || !requestIdPattern.test(requestId)) return error("Please reload the form and try again.", 400)

  const fields: Record<string, string> = {}
  for (const [name, { label, maxLength }] of Object.entries(rfqFields)) {
    const value = form.get(name)
    if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
      return error(`Please enter a valid value for ${label}.`, 400)
    }
    fields[name] = value.trim()
  }
  if (!emailPattern.test(fields.email)) return error("Please enter a valid email address.", 400)
  if (!rfqEnquiryTypes.includes(fields.enquiryType)) return error("Please select a valid enquiry type.", 400)

  const files = form.getAll("attachments").filter(file => typeof file === "string" || file.name || file.size)
  if (files.length > rfqMaxAttachments) return error(`Attach up to ${rfqMaxAttachments} files.`, 400)
  const attachments = []
  let attachmentBytes = 0
  for (const file of files) {
    if (typeof file === "string" || !file.size) return error("Please select a valid attachment.", 400)
    attachmentBytes += file.size
    if (attachmentBytes > rfqMaxAttachmentBytes) return error("Attachments must total 4 MB or less.", 413)
    const filename = file.name.replace(/[^a-zA-Z0-9._ -]/g, "_").trim()
    const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase()
    if (filename.length > 180 || !rfqAttachmentTypes.includes(extension)) return error("Attach PDF, XLSX, PNG or JPEG files with a valid filename.", 400)
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
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `zadco-rfq/${submissionKey}`,
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: fields.email,
        subject: `ZADCO enquiry ${reference}`,
        text: `Reference: ${reference}\n\n${details}`,
        attachments,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!delivery.ok) return error("We couldn’t accept your enquiry. Please try again later.", 502)
  } catch {
    return error("We couldn’t confirm your submission. Please try again later.", 502)
  }
  return Response.json({ reference }, { headers: { "Cache-Control": "no-store" } })
}

export default { fetch: (request: Request) => handleRfq(request) }
