const COUNTRY_CODE_BY_NAME = {
  Argentina: 'AR',
  Australia: 'AU',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Belgium: 'BE',
  Bolivia: 'BO',
  Brazil: 'BR',
  Bulgaria: 'BG',
  Canada: 'CA',
  Chile: 'CL',
  Colombia: 'CO',
  'Costa Rica': 'CR',
  Croatia: 'HR',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  France: 'FR',
  Greece: 'GR',
  Guatemala: 'GT',
  Honduras: 'HN',
  Iceland: 'IS',
  India: 'IN',
  Iran: 'IR',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Korea: 'KR',
  Luxembourg: 'LU',
  Malaysia: 'MY',
  Mauritius: 'MU',
  Mexico: 'MX',
  Nepal: 'NP',
  Netherlands: 'NL',
  Pakistan: 'PK',
  Panama: 'PA',
  Paraguay: 'PY',
  Peru: 'PE',
  Poland: 'PL',
  Portugal: 'PT',
  'Puerto Rico': 'PR',
  Romania: 'RO',
  Russia: 'RU',
  Singapore: 'SG',
  Slovakia: 'SK',
  'South Africa': 'ZA',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Switzerland: 'CH',
  Taiwan: 'TW',
  Tanzania: 'TZ',
  Tunisia: 'TN',
  Turkey: 'TR',
  Ukraine: 'UA',
  'United Kingdom': 'GB',
  'United States of America': 'US',
  Uruguay: 'UY',
  Venezuela: 'VE'
}

function countryCodeToFlagEmoji(countryCode) {
  return String(countryCode)
    .trim()
    .toUpperCase()
    .replace(/./g, (letter) =>
      String.fromCodePoint(127397 + letter.charCodeAt(0))
    )
}

function resolveCountryFlag(countryName) {
  const countryCode = COUNTRY_CODE_BY_NAME[countryName]
  return countryCode ? countryCodeToFlagEmoji(countryCode) : ''
}

export function getCountryFlagSegments(countryLabel) {
  return String(countryLabel ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      flag: resolveCountryFlag(name)
    }))
}
