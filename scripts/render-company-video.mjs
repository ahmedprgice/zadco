import { createRequire } from "node:module"
import { spawn, execFileSync } from "node:child_process"
import { once } from "node:events"
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const require = createRequire(import.meta.url)
const { chromium } = require("C:/Users/ahmed/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright")
const python = "C:/Users/ahmed/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe"
const encoder = execFileSync(python, ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8" }).trim()
const output = resolve("public/videos")
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: "msedge", headless: true })
let process
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto("http://localhost:8443/about")
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('700 64px "Roboto Condensed"'),
      document.fonts.load('400 26px "Roboto"'),
    ])
    const canvas = document.createElement("canvas")
    canvas.width = 1280
    canvas.height = 720
    const context = canvas.getContext("2d")
    const paths = ["home-offshore-hero.png", "equipment-pumps.png", "industry-refinery.jpg", "company-overview-pipelines.jpg", "offshore-rig-sunset.png", "zadco-primary-full-reversed.png"]
    const images = await Promise.all(paths.map(path => new Promise((accept, reject) => {
      const image = new Image()
      image.onload = () => accept(image)
      image.onerror = reject
      image.src = `/images/${path}`
    })))
    const scenes = [
      { label: "ZADCO OILFIELD TRADING LLC", lines: ["Supply for", "energy operations."], copy: ["Oilfield equipment, industrial tools", "and petrochemicals."] },
      { label: "EQUIPMENT & INDUSTRIAL TOOLS", lines: ["Defined by", "your specification."], copy: ["From drilling and production to maintenance.", "Equipment, components and tools to your brief."] },
      { label: "PETROCHEMICALS & INDUSTRIAL FLUIDS", lines: ["Products for", "your application."], copy: ["Chemicals, lubricants and industrial fluids.", "Sourcing starts with your grade and requirements."] },
      { label: "OUR SOURCING PROCESS", lines: ["A clear route from", "enquiry to order."], copy: ["Share your brief. Review the options.", "Assess the quotation. Confirm the supply scope."] },
      { label: "YOUR NEXT REQUIREMENT", lines: ["Clear requirements.", "Focused sourcing."], copy: ["Start with your equipment list or specification.", "ZADCO Oilfield Trading LLC"] },
    ]
    const ease = n => 1 - Math.pow(1 - Math.max(0, Math.min(1, n)), 3)
    function drawScene(index, elapsed) {
      context.save()
      const image = images[index]
      const scale = Math.max(1280 / image.width, 720 / image.height) * (1.02 + elapsed * 0.035)
      const width = image.width * scale
      const height = image.height * scale
      context.drawImage(image, (1280 - width) / 2 + elapsed * 12, (720 - height) / 2, width, height)
      context.fillStyle = "rgba(20,39,51,0.57)"
      context.fillRect(0, 0, 1280, 720)
      // The left-hand veil keeps every title legible without framing it in a card.
      const veil = context.createLinearGradient(0, 0, 1100, 0)
      veil.addColorStop(0, "rgba(20,39,51,0.76)")
      veil.addColorStop(1, "rgba(20,39,51,0)")
      context.fillStyle = veil
      context.fillRect(0, 0, 1280, 720)
      const logo = images[5]
      context.drawImage(logo, 72, 54, 290, 290 * logo.height / logo.width)
      const arrival = ease(elapsed * 7)
      context.translate(0, (1 - arrival) * 18)
      context.globalAlpha = arrival
      context.fillStyle = "#e87522"
      context.fillRect(72, 226, 48, 3)
      context.fillStyle = "#f4f5f3"
      context.font = '500 18px "Roboto", Arial'
      context.fillText(scenes[index].label, 138, 234)
      context.font = '700 72px "Roboto Condensed", Arial'
      scenes[index].lines.forEach((line, n) => context.fillText(line, 72, 330 + n * 82))
      context.font = '400 26px "Roboto", Arial'
      context.fillStyle = "#f4f5f3"
      scenes[index].copy.forEach((line, n) => context.fillText(line, 76, 485 + n * 40))
      context.restore()
    }
    window.renderCompanyFrame = seconds => {
      context.fillStyle = "#142733"
      context.fillRect(0, 0, 1280, 720)
      const index = Math.min(4, Math.floor(seconds / 5))
      const local = seconds - index * 5
      if (index > 0 && local < 0.6) {
        drawScene(index - 1, 1)
        context.save()
        context.globalAlpha = local / 0.6
        // Composite a complete incoming scene to preserve crossfade opacity.
        const previous = context.getImageData(0, 0, 1280, 720)
        context.globalAlpha = 1
        drawScene(index, local / 5)
        const incoming = context.getImageData(0, 0, 1280, 720)
        const mix = local / 0.6
        for (let n = 0; n < incoming.data.length; n += 4) {
          for (let channel = 0; channel < 3; channel++) incoming.data[n + channel] = previous.data[n + channel] * (1 - mix) + incoming.data[n + channel] * mix
        }
        context.putImageData(incoming, 0, 0)
        context.restore()
      } else drawScene(index, local / 5)
      context.fillStyle = "rgba(244,245,243,0.72)"
      context.font = '400 14px "Roboto", Arial'
      context.fillText("Illustrative industry imagery", 76, 661)
      context.fillStyle = "rgba(244,245,243,0.24)"
      context.fillRect(76, 680, 1128, 2)
      context.fillStyle = "#e87522"
      context.fillRect(76, 680, 1128 * seconds / 25, 2)
      return canvas.toDataURL("image/jpeg", 0.9).split(",")[1]
    }
  })
  process = spawn(encoder, ["-y", "-loglevel", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", "24", "-i", "pipe:0", "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", resolve(output, "zadco-introduction.mp4")], { stdio: ["pipe", "ignore", "inherit"] })
  const completion = once(process, "close")
  for (let frame = 0; frame < 600; frame++) {
    const data = await page.evaluate(seconds => window.renderCompanyFrame(seconds), frame / 24)
    const bytes = Buffer.from(data, "base64")
    if (frame === 24) await writeFile(resolve(output, "zadco-introduction-poster.jpg"), bytes)
    if (!process.stdin.write(bytes)) await once(process.stdin, "drain")
    if (frame % 120 === 0) console.log(`Rendered ${frame / 24}s of 25s`)
  }
  process.stdin.end()
  const [code] = await completion
  if (code !== 0) throw new Error(`Video encoder exited with ${code}`)
  console.log("Video complete: public/videos/zadco-introduction.mp4")
} finally {
  process?.stdin.destroy()
  await browser.close()
}
