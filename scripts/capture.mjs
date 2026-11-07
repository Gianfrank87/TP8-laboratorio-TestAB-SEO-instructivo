import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000/bitacora", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const section = document.querySelectorAll(".stats-section")[1];
    if (!section) throw new Error("No se encontró el caso de prueba");
    const margin = document.createElement("aside");
    margin.setAttribute("aria-label", "Cálculos del caso de prueba");
    margin.style.cssText = "background:#fffef7;border:2px solid #3c473b;margin:20px 0;padding:20px 25px;font:18px/1.8 monospace;transform:rotate(-.4deg);max-width:650px";
    margin.innerHTML = "<strong>CÁLCULO DEL CASO FIJO</strong><div>A = 18 / 240 × 100 = 7,50 %</div><div>B = 31 / 236 × 100 = 13,14 %</div><div>B − A = 13,14 − 7,50 = 5,64 pp</div>";
    section.append(margin);
  });
  await mkdir("evidencia", { recursive: true });
  await page.screenshot({ path: "evidencia/bitacora.png", fullPage: true });
} finally {
  await browser.close();
}
