import { keys } from '../object/keys'
import { Country, countryMap } from './countryMap'

export const getCountryCodeByPhone = (phone: string): Country | undefined => {
  const candidates = keys(countryMap).filter((country) => phone.includes(countryMap[country].dialCode))

  if (candidates.length === 1) return candidates[0]

  // more than 1 result, disambiguate
  return (
    candidates.find((country) => {
      const countryData = countryMap[country]
      const { dialCode } = countryData

      if (!('phoneAreaCodes' in countryData)) return false
      const phoneAreaCodes = countryData.phoneAreaCodes
      return phoneAreaCodes.some((areaCode) => phone.includes(dialCode + areaCode))
    })
    || candidates.find((country) => !('phoneAreaCodes' in countryMap[country]))
    || candidates[0]
  )
}
