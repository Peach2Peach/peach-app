import analytics from '@react-native-firebase/analytics'
import { Contract } from '../../../peach-api/src/@types/contract'

export const logTradeCompleted = (contract: Contract) => {
  analytics().logEvent('trade_completed', {
    amount: contract.amount,
    value: contract.price,
    currency: contract.currency,
    payment_method: contract.paymentMethod,
  })
}
