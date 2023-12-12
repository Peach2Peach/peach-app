import { getCountryCodeByPhone } from '../country/getCountryCodeByPhone'
import { isHighRiskCountry } from '../country/isHighRiskCountry'

export const isPhoneAllowed = (phone: string) => {
  const country = getCountryCodeByPhone(phone)
  return country !== 'US' && !isHighRiskCountry(country)
}
