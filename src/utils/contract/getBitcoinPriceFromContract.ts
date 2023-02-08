import { SATSINBTC } from '../../constants'
import { round } from '../math'

export const getBitcoinPriceFromContract = ({
  price,
  premium,
  amount,
}: {
  price: Contract['price']
  premium: Contract['premium']
  amount: Contract['amount']
}) => round(((price - premium) / amount) * SATSINBTC, 2)
