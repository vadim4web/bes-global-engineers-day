import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import weekday from 'dayjs/plugin/weekday.js'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)
dayjs.extend(weekday)
dayjs.extend(isBetween)

const MONTH_MAP = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
}

const WEEKDAY_INDEX = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
}

const ORDINAL_MAP = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  last: -1
}

function createBaseRule() {
  return {
    ruleType: 'unsupported',
    month: null,
    day: null,
    startMonth: null,
    startDay: null,
    endMonth: null,
    endDay: null,
    ordinal: null,
    weekday: null,
    weekMode: null,
    isOneTime: false,
    isRecurring: false,
    parseStatus: 'manual_review',
    reviewReason: 'unrecognized_pattern'
  }
}

function cleanDateText(value) {
  return String(value ?? '')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/[–—]/g, ' to ')
    .replace(/\s+/g, ' ')
    .trim()
}

function monthNumber(label) {
  return MONTH_MAP[label.toLowerCase()] ?? null
}

function assignParsedRule(rule, updates) {
  return {
    ...rule,
    ...updates,
    parseStatus: 'parsed',
    reviewReason: null
  }
}

export function parseEngineerDayDate(rawDateText, note = '') {
  const rule = createBaseRule()
  const dateText = cleanDateText(rawDateText)
  const noteText = cleanDateText(note)
  const combined = `${dateText} ${noteText}`.toLowerCase()

  if (!dateText) {
    return {
      ...rule,
      reviewReason: 'missing_date_text'
    }
  }

  if (/only celebrated in \d{4}/i.test(combined)) {
    rule.isOneTime = true
    rule.isRecurring = false
  }

  if (/vikram samvat|shrawan/i.test(combined)) {
    return {
      ...rule,
      reviewReason: 'calendar_based'
    }
  }

  if (/movable/i.test(combined)) {
    return {
      ...rule,
      reviewReason: 'movable_date'
    }
  }

  if (/date variable/i.test(combined)) {
    return {
      ...rule,
      reviewReason: 'variable_date'
    }
  }

  let match = dateText.match(
    /^(first|second|third|fourth|fifth|last)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+of\s+([a-z]+)(?:\s+\(.*\))?$/i
  )
  if (match) {
    return assignParsedRule(rule, {
      ruleType: 'ordinal_weekday',
      month: monthNumber(match[3]),
      ordinal: ORDINAL_MAP[match[1].toLowerCase()],
      weekday: match[2].toLowerCase(),
      isRecurring: !rule.isOneTime
    })
  }

  match = dateText.match(
    /^(first|second|third|fourth|fifth|last)\s+week\s+of\s+([a-z]+)(?:\s+annually)?$/i
  )
  if (match) {
    return assignParsedRule(rule, {
      ruleType: 'annual_week',
      month: monthNumber(match[2]),
      ordinal: ORDINAL_MAP[match[1].toLowerCase()],
      weekMode: 'month_week',
      isRecurring: !rule.isOneTime
    })
  }

  match = dateText.match(/^week of\s+([a-z]+)\s+(\d{1,2})$/i)
  if (match) {
    return assignParsedRule(rule, {
      ruleType: 'week_containing_date',
      month: monthNumber(match[1]),
      day: Number(match[2]),
      weekMode: 'contains_date',
      isRecurring: !rule.isOneTime
    })
  }

  match = dateText.match(
    /^week of\s+(\d{1,2})\s+to\s+(\d{1,2})\s+([a-z]+)(?:\s+\(([^)]+)\))?(?:\s+\d{4})?$/i
  )
  if (match) {
    return assignParsedRule(rule, {
      ruleType: 'week_range',
      startMonth: monthNumber(match[3]),
      startDay: Number(match[1]),
      endMonth: monthNumber(match[3]),
      endDay: Number(match[2]),
      weekMode: 'named_week',
      isRecurring: !rule.isOneTime
    })
  }

  match = dateText.match(/^(\d{1,2})\s+to\s+(\d{1,2})\s+([a-z]+)(?:\s+\d{4})?$/i)
  if (match) {
    return assignParsedRule(rule, {
      ruleType: 'date_range',
      startMonth: monthNumber(match[3]),
      startDay: Number(match[1]),
      endMonth: monthNumber(match[3]),
      endDay: Number(match[2]),
      isRecurring: !rule.isOneTime
    })
  }

  match = dateText.match(/^([a-z]+)\s+(\d{1,2})(?:,\s*|\s+)?(\d{4})?$/i)
  if (match && monthNumber(match[1])) {
    return assignParsedRule(rule, {
      ruleType: 'fixed_date',
      month: monthNumber(match[1]),
      day: Number(match[2]),
      isRecurring: !rule.isOneTime
    })
  }

  match = dateText.match(/^(\d{1,2})\s+([a-z]+)(?:,\s*|\s+)?(\d{4})?$/i)
  if (match && monthNumber(match[2])) {
    return assignParsedRule(rule, {
      ruleType: 'fixed_date',
      month: monthNumber(match[2]),
      day: Number(match[1]),
      isRecurring: !rule.isOneTime
    })
  }

  return rule
}

function formatOccurrenceLabel(start, end) {
  if (!start || !end) {
    return ''
  }

  if (start.isSame(end, 'day')) {
    return start.format('MMMM D')
  }

  if (start.isSame(end, 'month')) {
    return `${start.format('MMMM D')} to ${end.format('D')}`
  }

  return `${start.format('MMMM D')} to ${end.format('MMMM D')}`
}

function resolveOrdinalWeekday(month, ordinal, weekdayName, year) {
  const monthStart = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
  const targetDay = WEEKDAY_INDEX[weekdayName]

  if (targetDay === undefined) {
    return null
  }

  if (ordinal === -1) {
    let cursor = monthStart.endOf('month').startOf('day')
    while (cursor.day() !== targetDay) {
      cursor = cursor.subtract(1, 'day')
    }
    return cursor
  }

  let cursor = monthStart.startOf('day')
  while (cursor.day() !== targetDay) {
    cursor = cursor.add(1, 'day')
  }

  cursor = cursor.add((ordinal - 1) * 7, 'day')
  return cursor.month() + 1 === month ? cursor : null
}

export function resolveRuleForYear(rule, year) {
  if (!rule || rule.parseStatus !== 'parsed') {
    return null
  }

  switch (rule.ruleType) {
    case 'fixed_date': {
      const start = dayjs(
        `${year}-${String(rule.month).padStart(2, '0')}-${String(rule.day).padStart(2, '0')}`
      ).startOf('day')

      return {
        start,
        end: start,
        primaryDate: start,
        label: formatOccurrenceLabel(start, start)
      }
    }

    case 'date_range':
    case 'week_range': {
      const start = dayjs(
        `${year}-${String(rule.startMonth).padStart(2, '0')}-${String(rule.startDay).padStart(2, '0')}`
      ).startOf('day')
      const end = dayjs(
        `${year}-${String(rule.endMonth).padStart(2, '0')}-${String(rule.endDay).padStart(2, '0')}`
      ).startOf('day')

      return {
        start,
        end,
        primaryDate: start,
        label: formatOccurrenceLabel(start, end)
      }
    }

    case 'ordinal_weekday': {
      const start = resolveOrdinalWeekday(rule.month, rule.ordinal, rule.weekday, year)
      if (!start) {
        return null
      }

      return {
        start,
        end: start,
        primaryDate: start,
        label: formatOccurrenceLabel(start, start)
      }
    }

    case 'annual_week': {
      let start = dayjs(`${year}-${String(rule.month).padStart(2, '0')}-01`).startOf('day')

      if (rule.ordinal === -1) {
        start = start.endOf('month').subtract(6, 'day').startOf('day')
      } else {
        start = start.add((rule.ordinal - 1) * 7, 'day')
      }

      const end = start.add(6, 'day')
      return {
        start,
        end,
        primaryDate: start,
        label: formatOccurrenceLabel(start, end)
      }
    }

    case 'week_containing_date': {
      const anchor = dayjs(
        `${year}-${String(rule.month).padStart(2, '0')}-${String(rule.day).padStart(2, '0')}`
      ).startOf('day')
      const start = anchor.startOf('week')
      const end = anchor.endOf('week').startOf('day')

      return {
        start,
        end,
        primaryDate: anchor,
        label: formatOccurrenceLabel(start, end)
      }
    }

    default:
      return null
  }
}

function normalizeRows(data) {
  if (Array.isArray(data)) {
    return data
  }

  return data?.rows ?? []
}

function buildUpcomingEntry(entry, occurrence, from) {
  const isOngoing = from.isBetween(occurrence.start, occurrence.end, 'day', '[]')

  return {
    ...entry,
    occurrence,
    isOngoing,
    daysUntilStart: occurrence.start.diff(from.startOf('day'), 'day'),
    displayLabel: occurrence.label
  }
}

export function getUpcomingEngineerDays(data, fromDate = dayjs(), limit = 5) {
  const from = dayjs(fromDate).startOf('day')
  const rows = normalizeRows(data)
  const upcoming = []

  rows.forEach((entry) => {
    const rule = entry.normalizedRule ?? entry
    if (!rule.isRecurring || rule.isOneTime || rule.parseStatus !== 'parsed') {
      return
    }

    const currentYear = resolveRuleForYear(rule, from.year())
    if (!currentYear) {
      return
    }

    let occurrence = currentYear

    if (occurrence.end.isBefore(from, 'day')) {
      occurrence = resolveRuleForYear(rule, from.year() + 1)
    }

    if (!occurrence) {
      return
    }

    upcoming.push(buildUpcomingEntry(entry, occurrence, from))
  })

  return upcoming
    .sort((left, right) => left.occurrence.start.valueOf() - right.occurrence.start.valueOf())
    .slice(0, limit)
}

export function getNextEngineerDay(data, fromDate = dayjs()) {
  return getUpcomingEngineerDays(data, fromDate, 1)[0] ?? null
}
