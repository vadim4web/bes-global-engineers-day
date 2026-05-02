import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

dayjs.extend(customParseFormat)

export function getRouteDateValue(route) {
  const paramDate = Array.isArray(route.params?.d)
    ? route.params.d[0]
    : route.params?.d
  const queryDate = Array.isArray(route.query?.d)
    ? route.query.d[0]
    : route.query?.d

  return paramDate || queryDate || undefined
}

export function resolveAppDate(dateValue, fallback = new Date()) {
  if (dateValue === undefined || dateValue === null || dateValue === '') {
    return dayjs(fallback)
  }

  if (typeof dateValue === 'string') {
    const strictDate = dayjs(dateValue, ['YYYY-MM-DD', 'YYYY/MM/DD'], true)
    if (strictDate.isValid()) {
      return strictDate
    }
  }

  const parsed = dayjs(dateValue)
  return parsed.isValid() ? parsed : dayjs(fallback)
}
