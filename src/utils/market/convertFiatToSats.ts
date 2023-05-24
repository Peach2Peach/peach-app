import { SATSINBTC } from '../../constants'
import { round } from '../math'

export const convertFiatToSats = (amount: number, bitcoinPrice: number) => round((amount / bitcoinPrice) * SATSINBTC)
