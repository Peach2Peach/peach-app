export const toggleCurrency = (currency: Currency) => (currencies: Currency[]) => {
  if (!currencies.includes(currency)) {
    currencies.push(currency)
  } else {
    currencies = currencies.filter((c) => c !== currency)
  }
  return [...currencies]
}
