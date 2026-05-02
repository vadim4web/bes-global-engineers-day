import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'cheerio'
import {
  describeEngineerDayRule,
  parseEngineerDayDate
} from '../src/utils/engineerDayDateRules.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const SOURCE_URL = 'https://en.wikipedia.org/wiki/Engineer%27s_Day'
const rawHtmlCachePath = path.join(__dirname, 'cache', 'engineers-day.wikipedia.html')
const normalizedCachePath = path.join(__dirname, 'cache', 'engineerDays.normalized.cache.json')
const outputPath = path.join(projectRoot, 'src', 'data', 'engineerDays.normalized.json')

const NOTE_OVERRIDES = {
  Argentina: "Commemorates the 1855 launch of the country's first Civil Engineering degree at the University of Buenos Aires.",
  Australia: "Celebrated as part of Australian Engineering Week, a public showcase of engineers' contributions to everyday life.",
  Bangladesh: 'Marks the 1948 founding of the Institution of Engineers, Bangladesh.',
  Brazil: 'Commemorates Law No. 23,659 of 1933, which regulated the professions of engineer, architect, and surveyor in Brazil.',
  Colombia: 'Commemorates the 1887 founding of the Sociedad Colombiana de Ingenieros.',
  'Costa Rica': "Aligns with Pan-American Engineer's Day.",
  Croatia: "Commemorates the 1878 founding of Zagreb's first engineers' association.",
  France: 'Observed in tribute to the 1848 creation of the Societe Civile des Ingenieurs, now IESF, and the 1968 creation of WFEO. Since 2020, the date also coincides with UNESCO World Engineering Day for Sustainable Development.',
  India: 'Celebrated since 1968 in honor of Sir Mokshagundam Visvesvaraya.',
  Iran: 'Honours Nasir al-Din al-Tusi and is marked around his commemoration day in Iran.',
  Ireland: 'Engineers Ireland runs it as an annual nationwide campaign introducing young people to engineering.',
  Israel: "Known locally as Israel Engineer's Day.",
  Malaysia: "Observed as part of Malaysia's Engineers Week.",
  Nepal: 'Celebrated on Software Freedom Day.',
  Netherlands: "KIVI uses Engineers' Day for its annual congress and the presentation of the Prince Friso Engineering Award.",
  Pakistan: 'Marked the founding of the Pakistan Engineering Council and was celebrated only in 2014.',
  'Puerto Rico': "Observed as Engineers' and Geometers' Week.",
  Russia: "Recognized as Power Engineer's Day.",
  Singapore: 'Organised by the Institution of Engineers, Singapore to promote engineering to the community.',
  Switzerland: 'Launched nationwide in 2018 by Daniel Lohr and Christian Vils to recognize engineers contributions.',
  Ukraine: "Known locally as Engineer's Day and intended as a public expression of gratitude to engineers for their work.",
  'United Kingdom': 'Led by the Royal Academy of Engineering since 2019 as a national awareness day celebrating how engineers shape the future.',
  'United States of America': "Founded in 1951 by the National Society of Professional Engineers in conjunction with George Washington's birthday.",
  Venezuela: 'Commemorates the 1861 installation of the Colegio de Ingenieros de Venezuela.'
}

function cleanCellText(value) {
  return String(value ?? '')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function ensureSentence(value) {
  const normalized = cleanCellText(value)

  if (!normalized) {
    return ''
  }

  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`
}

function splitIntoNoteLines(value) {
  return String(value ?? '')
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z"])/g))
    .map((line) => line.trim())
    .filter(Boolean)
}

function joinNoteLines(...parts) {
  const lines = parts.flatMap((part) => splitIntoNoteLines(part))
  return lines.join('\n')
}

function buildReviewNote(rule) {
  if (rule?.reviewReason === 'variable_date') {
    return 'The recurring rule varies by year and still needs manual review.'
  }

  if (rule?.reviewReason === 'movable_date') {
    return 'The recurring rule is movable and still needs manual review.'
  }

  if (rule?.reviewReason === 'calendar_based') {
    return 'The recurring rule depends on a non-Gregorian calendar and still needs manual review.'
  }

  return ''
}

function buildRowNote(country, originalNote, normalizedRule) {
  const baseNote = ensureSentence(NOTE_OVERRIDES[country] ?? originalNote)
  const ruleNote = ensureSentence(describeEngineerDayRule(normalizedRule))

  if (!baseNote && !ruleNote) {
    return buildReviewNote(normalizedRule)
  }

  if (!baseNote) {
    return joinNoteLines(ruleNote)
  }

  if (!ruleNote || normalizedRule?.isOneTime) {
    return joinNoteLines(baseNote)
  }

  return joinNoteLines(baseNote, ruleNote)
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

    const normalizedRule = applyCountrySpecificOverride(
      country,
      rawDateText,
      note,
      parseEngineerDayDate(rawDateText, note)
    )

    rows.push({
      country,
      rawDateText,
      note: buildRowNote(country, note, normalizedRule),
      sourceUrl: SOURCE_URL,
      normalizedRule
    })
  })

  return rows
}

function applyCountrySpecificOverride(country, rawDateText, note, normalizedRule) {
  if (
    country === 'Malaysia' &&
    /movable/i.test(rawDateText)
  ) {
    return {
      ...normalizedRule,
      ruleType: 'weekday',
      month: 8,
      day: null,
      startMonth: null,
      startDay: null,
      endMonth: null,
      endDay: null,
      ordinal: -1,
      weekday: 'Sunday',
      weekMode: null,
      isOneTime: false,
      isRecurring: true,
      parseStatus: 'success',
      reviewReason: null
    }
  }

  if (
    country === 'Nepal' &&
    /software freedom day/i.test(note)
  ) {
    return {
      ...normalizedRule,
      ruleType: 'weekday',
      month: 9,
      day: null,
      startMonth: null,
      startDay: null,
      endMonth: null,
      endDay: null,
      ordinal: 3,
      weekday: 'Saturday',
      weekMode: null,
      isOneTime: false,
      isRecurring: true,
      parseStatus: 'success',
      reviewReason: null
    }
  }

  return normalizedRule
}

function isSuccessfulParseStatus(status) {
  return status === 'parsed' || status === 'success'
}

function summarizeRows(rows) {
  return {
    totalRows: rows.length,
    automaticallyParsedRows: rows.filter(
      (entry) => isSuccessfulParseStatus(entry.normalizedRule.parseStatus)
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
