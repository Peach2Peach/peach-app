import analytics from '@react-native-firebase/analytics'

export const logTradeCompleted = (contract: Contract) => {
  analytics().logEvent('trade_completed', {
    amount: contract.amount,
    value: contract.price,
    currency: contract.currency,
    payment_method: contract.paymentMethod,
  })
}
