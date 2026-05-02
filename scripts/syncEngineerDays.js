import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'cheerio'
import { parseEngineerDayDate } from '../src/utils/engineerDayDateRules.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const SOURCE_URL = 'https://en.wikipedia.org/wiki/Engineer%27s_Day'
const rawHtmlCachePath = path.join(__dirname, 'cache', 'engineers-day.wikipedia.html')
const normalizedCachePath = path.join(__dirname, 'cache', 'engineerDays.normalized.cache.json')
const outputPath = path.join(projectRoot, 'src', 'data', 'engineerDays.normalized.json')

function cleanCellText(value) {
  return String(value ?? '')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function loadRemoteHtml() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      'user-agent': 'bes-engineers-day-promo-sync/1.0'
    }
  })

  if (!response.ok) {
    throw new Error(`Wikipedia request failed with ${response.status}`)
  }

  const html = await response.text()

  if (!html.includes('wikitable')) {
    throw new Error('Expected country-wise wikitable was not found in response HTML.')
  }

  await fs.writeFile(rawHtmlCachePath, html, 'utf8')
  return html
}

async function getHtmlSource() {
  try {
    const html = await loadRemoteHtml()
    return { html, source: 'remote' }
  } catch (error) {
    if (await fileExists(rawHtmlCachePath)) {
      const html = await fs.readFile(rawHtmlCachePath, 'utf8')
      return { html, source: 'cache:html', warning: error.message }
    }

    if (await fileExists(normalizedCachePath)) {
      const cachedJson = await fs.readFile(normalizedCachePath, 'utf8')
      await fs.writeFile(outputPath, cachedJson, 'utf8')
      return { html: null, source: 'cache:json', warning: error.message }
    }

    throw error
  }
}

function findCountryTable($) {
  const tables = $('table.wikitable')

  const match = tables
    .filter((_, table) => {
      const headers = $(table)
        .find('th')
        .slice(0, 3)
        .map((__, cell) => cleanCellText($(cell).text()).toLowerCase())
        .get()

      return headers.includes('country') && headers.includes('date')
    })
    .first()

  return match.length ? match : null
}

function parseRowsFromTable(table, $) {
  const rows = []

  table.find('tr').slice(1).each((_, row) => {
    const cells = $(row).children('th, td')
    if (cells.length < 2) {
      return
    }

    const country = cleanCellText($(cells[0]).text())
    const rawDateText = cleanCellText($(cells[1]).text())
    const note = cleanCellText($(cells[2]).text())

    if (!country || !rawDateText) {
      return
    }

    rows.push({
      country,
      rawDateText,
      note,
      sourceUrl: SOURCE_URL,
      normalizedRule: parseEngineerDayDate(rawDateText, note)
    })
  })

  return rows
}

function summarizeRows(rows) {
  return {
    totalRows: rows.length,
    automaticallyParsedRows: rows.filter(
      (entry) => entry.normalizedRule.parseStatus === 'parsed'
    ).length,
    manualReviewRows: rows.filter(
      (entry) => entry.normalizedRule.parseStatus === 'manual_review'
    ).length,
    unsupportedMovableOrCalendarRows: rows.filter((entry) =>
      ['movable_date', 'calendar_based', 'variable_date'].includes(
        entry.normalizedRule.reviewReason
      )
    ).length,
    excludedOneTimeEvents: rows.filter((entry) => entry.normalizedRule.isOneTime).length
  }
}

async function main() {
  const { html, source, warning } = await getHtmlSource()

  if (source === 'cache:json') {
    console.log('Wikipedia fetch failed. Reused cached normalized JSON.')
    if (warning) {
      console.log(`Reason: ${warning}`)
    }
    return
  }

  const $ = load(html)
  const table = findCountryTable($)

  if (!table) {
    throw new Error('Could not locate the Engineer’s Day country-wise table.')
  }

  const rows = parseRowsFromTable(table, $)
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceUrl: SOURCE_URL,
    syncSource: source,
    summary: summarizeRows(rows),
    rows
  }

  const json = `${JSON.stringify(payload, null, 2)}\n`
  await fs.writeFile(outputPath, json, 'utf8')
  await fs.writeFile(normalizedCachePath, json, 'utf8')

  console.log(`Engineer’s Day sync complete using ${source}.`)
  if (warning) {
    console.log(`Remote fetch fallback reason: ${warning}`)
  }
  console.log(`Rows: ${payload.summary.totalRows}`)
  console.log(`Parsed automatically: ${payload.summary.automaticallyParsedRows}`)
  console.log(`Manual review: ${payload.summary.manualReviewRows}`)
  console.log(`Excluded one-time events: ${payload.summary.excludedOneTimeEvents}`)
}

main().catch((error) => {
  console.error('Engineer’s Day sync failed.')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
