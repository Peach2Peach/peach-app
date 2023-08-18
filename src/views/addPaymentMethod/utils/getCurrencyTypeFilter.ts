import { CURRENCY_MAP } from '../../../paymentMethods'
import { CurrencyType } from '../../../store/offerPreferenes/types'

export const getCurrencyTypeFilter = (type: CurrencyType) => (currency: Currency) =>
  CURRENCY_MAP[type].includes(currency)
