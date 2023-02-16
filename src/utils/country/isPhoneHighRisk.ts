import { getCountryCodeByPhone } from './getCountryCodeByPhone'
import { isHighRiskCountry } from './isHighRiskCountry'

export const isPhoneHighRisk = (phone: string) => isHighRiskCountry(getCountryCodeByPhone(phone))
