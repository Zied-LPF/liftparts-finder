import { chromium } from 'playwright'

async function test() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const query = '5300' // tu peux changer pour tester d'autres références
  const url = `https://my.sodimas.com/fr/recherche?searchstring=${query}`

  console.log('Opening:', url)

  await page.goto(url, { waitUntil: 'networkidle' })

  // Attendre que les lignes de résultats soient rendues
  await page.waitForSelector('tbody tr')

  const results = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'))

    return rows.map(row => {
      const text = row.innerText.replace(/\s+/g, ' ').trim()

      // Extraire la référence
      const refMatch = text.match(/Réf\s*:\s*([A-Z0-9]+)/i)
      const reference = refMatch ? refMatch[1] : ''

      // Extraire le stock
      const stockMatch = text.match(/(En stock pour livraison|Réappro\. en cours)/i)
      const stock = stockMatch ? stockMatch[1] : ''

      // Nettoyer la désignation (enlever référence + stock)
      let designation = text
        .replace(/Réf\s*:\s*[A-Z0-9]+/i, '')
        .replace(/(En stock pour livraison|Réappro\. en cours)/i, '')
        .trim()

      return { reference, designation, stock }
    })
  })

  console.log('Results:', results)

  await browser.close()
}

test()