import { getCountryCodeByPhone, isHighRiskCountry } from '../country'

export const isPhoneAllowed = (phone: string) => {
  const country = getCountryCodeByPhone(phone)
  return country !== 'US' && !isHighRiskCountry(country)
}
