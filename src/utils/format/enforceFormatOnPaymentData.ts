import { enforceBICFormat } from './enforceBICFormat'
import { enforceEmailFormat } from './enforceEmailFormat'
import { enforceIBANFormat } from './enforceIBANFormat'
import { enforcePhoneFormat } from './enforcePhoneFormat'
import { enforceUsernameFormat } from './enforceUsernameFormat'

const VERSION = '0.2.0'
const formatters: Record<string, (value: string) => string> = {
  phone: enforcePhoneFormat,
  iban: enforceIBANFormat,
  bic: enforceBICFormat,
  userName: enforceUsernameFormat,
  email: enforceEmailFormat,
}

export const enforceFormatOnPaymentData = (data: PaymentData) => {
  if (data.version === VERSION) return data
  const enforced = Object.keys(data).reduce((obj, key) => {
    const value: string = data[key]

    obj[key] = formatters[key] ? formatters[key](value) : value
    return obj
  }, {} as PaymentData)

  enforced.version = VERSION
  return enforced
}
