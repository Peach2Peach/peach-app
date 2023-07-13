export const getCurrencyTypeFilter = (type: 'europe' | 'other') => (currency: Currency) => {
  if (type === 'europe') return currency !== 'USDT'
  return currency === 'USDT'
}
