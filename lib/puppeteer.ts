let browserInstance: any = null

export async function getBrowser() {
  if (browserInstance) return browserInstance

  if (process.env.VERCEL) {
    const puppeteer = await import("puppeteer-core")
    const chromium = await import("@sparticuz/chromium")

    const chromiumResolved: any = chromium.default || chromium

    const executablePath =
      typeof chromiumResolved.executablePath === "function"
        ? await chromiumResolved.executablePath()
        : chromiumResolved.executablePath

    browserInstance = await puppeteer.launch({
      args: chromiumResolved.args || [],
      defaultViewport: chromiumResolved.defaultViewport,
      executablePath,
      headless: true,
    })
  } else {
    const puppeteer = await import("puppeteer")

    browserInstance = await puppeteer.launch({
      headless: true,
    })
  }

  return browserInstance
}