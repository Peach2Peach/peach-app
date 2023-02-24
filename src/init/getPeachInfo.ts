import { setPaymentMethods } from '../constants'
import { configStore } from '../store/configStore'
import { defaultAccount, updateTradingLimit } from '../utils/account'
import { error } from '../utils/log'
import { getInfo, getTradingLimit } from '../utils/peachAPI'
import { calculateClientServerTimeDifference } from './calculateClientServerTimeDifference'

/**
 * @description Method to fetch peach info and user trading limit and store values in constants
 */
export const getPeachInfo = async (account?: Account) => {
  const {
    paymentMethods,
    setPaymentMethods: setPaymentMethodsStore,
    setLatestAppVersion,
    setMinAppVersion,
    setPeachFee,
    setPeachPGPPublicKey,
  } = configStore.getState()

  const statusResponse = await calculateClientServerTimeDifference()

  if (!statusResponse || statusResponse.error) {
    error('Server not available', statusResponse)
    setPaymentMethods(paymentMethods)

    return statusResponse
  }

  const [[peachInfoResponse, err], [tradingLimit, tradingLimitErr]] = await Promise.all([
    getInfo({ timeout: 5000 }),
    account?.publicKey ? getTradingLimit({ timeout: 5000 }) : [defaultAccount.tradingLimit, null],
  ])

  if (!peachInfoResponse || !tradingLimit) {
    error('Error fetching peach info', JSON.stringify(err || tradingLimitErr))
  }
  if (tradingLimit) {
    updateTradingLimit(tradingLimit)
  }
  if (peachInfoResponse) {
    setPeachPGPPublicKey(peachInfoResponse.peach.pgpPublicKey)
    setPaymentMethodsStore(peachInfoResponse.paymentMethods)
    setPeachFee(peachInfoResponse.fees.escrow)
    setLatestAppVersion(peachInfoResponse.latestAppVersion)
    setMinAppVersion(peachInfoResponse.minAppVersion)
  }

  setPaymentMethods(peachInfoResponse?.paymentMethods || paymentMethods)
  return statusResponse
}
