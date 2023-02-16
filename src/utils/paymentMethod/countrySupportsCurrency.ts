import { FlagType } from '../../components/flags'

const map: Record<Currency, FlagType[]> = {
  EUR: ['DE', 'FR', 'IT', 'ES', 'NL'],
  CHF: ['CH'],
  GBP: ['GB', 'UK'],
  SEK: ['SE'],
  USD: ['US'],
}

export const countrySupportsCurrency = (currency: Currency) => (country: FlagType) => map[currency].includes(country)
