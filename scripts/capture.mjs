import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1365, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000/bitacora", { waitUntil: "networkidle" });
  await mkdir("evidencia", { recursive: true });
  await page.screenshot({ path: "evidencia/bitacora.png", fullPage: true });
} finally {
  await browser.close();
}
