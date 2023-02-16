import { Country, countryMap } from './countryMap'

export const getCountryCodeByPhone = (phone: string): Country | undefined =>
  (Object.keys(countryMap) as Country[]).find((country) => phone.includes(countryMap[country].dialCode))
