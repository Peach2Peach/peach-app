import { SATSINBTC } from '../../constants'
import { round } from '../math'

export const getPrice = (sats: number, bitcoinPrice: number) => round((bitcoinPrice * sats) / SATSINBTC, 2)
