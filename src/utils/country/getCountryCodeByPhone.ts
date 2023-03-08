import { Country, countryMap } from './countryMap'

export const getCountryCodeByPhone = (phone: string): Country | undefined => {
  const candidates = (Object.keys(countryMap) as Country[]).filter((country) =>
    phone.includes(countryMap[country].dialCode),
  )

  if (candidates.length === 1) return candidates[0]

  // more than 1 result, disambiguate
  return (
    candidates.find((country) => {
      const { dialCode, phoneAreaCodes } = countryMap[country]

      if (!phoneAreaCodes) return false
      return phoneAreaCodes.some((areaCode) => phone.includes(dialCode + areaCode))
    })
    || candidates.find((country) => !countryMap[country].phoneAreaCodes)
    || candidates[0]
  )
}
