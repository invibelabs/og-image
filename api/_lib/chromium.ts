import puppeteer, { Page } from "puppeteer-core"
import { getOptions } from "./options"
import { FileType } from "./types"

let _page: Page | null = null

async function getPage(isDev: boolean): Promise<Page> {
  if (_page) {
    return _page
  }
  const options = await getOptions(isDev)
  const browser = await puppeteer.launch(options)
  _page = await browser.newPage()

  if (!_page) {
    throw new Error("Failed to create new page")
  }

  return _page
}

export async function getScreenshot(
  html: string,
  type: FileType,
  isDev: boolean
): Promise<Buffer> {
  const page = await getPage(isDev)

  if (!page) {
    throw new Error("Failed to get page")
  }

  await page.setViewport({ width: 2048, height: 1170 })
  await page.setContent(html)
  const file = await page.screenshot({ type, encoding: "binary" })

  if (!Buffer.isBuffer(file)) {
    throw new Error("Screenshot must be a Buffer")
  }

  return file
}
