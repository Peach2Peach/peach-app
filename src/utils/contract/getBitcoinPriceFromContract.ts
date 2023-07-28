import { SATSINBTC } from '../../constants'
import { round } from '../math'

export const getBitcoinPriceFromContract = ({ price, amount }: Pick<Contract, 'price' | 'amount'>) =>
  round((price / amount) * SATSINBTC, 2)
