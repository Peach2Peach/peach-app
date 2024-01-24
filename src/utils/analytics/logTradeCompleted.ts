import analytics from '@react-native-firebase/analytics'
import { Contract } from '../../../peach-api/src/@types/contract'

export const logTradeCompleted = ({ amount, price, currency, paymentMethod }: Contract) =>
  analytics().logEvent('trade_completed', { amount, value: price, currency, payment_method: paymentMethod })
