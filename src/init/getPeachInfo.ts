import {
  setBuckets,
  setDeprecatedBuckets,
  setLatestAppVersion,
  setMinAppVersion,
  setPaymentMethods,
  setPeachFee,
  setPeachPGPPublicKey,
} from '../constants'
import { defaultAccount, updateTradingLimit } from '../utils/account'
import { error } from '../utils/log'
import { getInfo, getTradingLimit } from '../utils/peachAPI'
import { sessionStorage } from '../utils/session'
import { calculateClientServerTimeDifference } from './calculateClientServerTimeDifference'

/**
 * @description Method to fetch peach info and user trading limit and store values in constants
 */
export const getPeachInfo = async (account?: Account): Promise<GetInfoResponse | null> => {
  await calculateClientServerTimeDifference()

  const [[peachInfoResponse, err], [tradingLimit, tradingLimitErr]] = await Promise.all([
    getInfo({ timeout: 10000 }),
    account?.publicKey ? getTradingLimit({ timeout: 10000 }) : [defaultAccount.tradingLimit, null],
  ])

  let peachInfo = peachInfoResponse

  if (!peachInfo || !tradingLimit) {
    error('Error fetching peach info', JSON.stringify(err || tradingLimitErr))
    peachInfo = sessionStorage.getMap('peachInfo')
  }
  if (tradingLimit) {
    updateTradingLimit(tradingLimit)
  }
  if (peachInfo) {
    setPeachPGPPublicKey(peachInfo.peach.pgpPublicKey)
    setPaymentMethods(peachInfo.paymentMethods)
    setBuckets(peachInfo.buckets)
    setDeprecatedBuckets(peachInfo.deprecatedBuckets)
    setPeachFee(peachInfo.fees.escrow)
    setLatestAppVersion(peachInfo.latestAppVersion)
    setMinAppVersion(peachInfo.minAppVersion)
    sessionStorage.setMap('peachInfo', peachInfo)
  }

  return peachInfo
}
