import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
try {
  await mkdir("capturas", { recursive: true });

  const landing = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await landing.goto(base + "/practica?preview=a", { waitUntil: "networkidle" });
  await landing.screenshot({ path: "capturas/landing.png", fullPage: true });

  const bitacora = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await bitacora.goto(base + "/bitacora", { waitUntil: "networkidle" });
  const section = bitacora.locator(".stats-section").nth(1);
  await section.waitFor();
  await section.evaluate((element) => {
    const margin = document.createElement("aside");
    margin.setAttribute("aria-label", "Cálculos del caso de prueba");
    margin.style.cssText = "background:#fffef7;border:2px solid #3c473b;margin:20px 0;padding:20px 25px;font:18px/1.8 monospace;max-width:700px";
    margin.innerHTML = "<strong>CÁLCULOS DEL CASO FIJO</strong><div>A = 18 / 240 × 100 = 7,50 %</div><div>B = 31 / 236 × 100 = 13,14 %</div><div>B − A = 13,14 − 7,50 = 5,64 pp</div>";
    element.append(margin);
  });
  await bitacora.screenshot({ path: "capturas/bitacora.png", fullPage: true });
} finally {
  await browser.close();
}
