const otherCurrencies: Currency[] = ['USDT', 'SAT']
export const getCurrencyTypeFilter = (type: 'europe' | 'other') => (currency: Currency) => {
  if (type === 'europe') return !otherCurrencies.includes(currency)
  return otherCurrencies.includes(currency)
}
