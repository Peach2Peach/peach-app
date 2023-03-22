import { PAYMENTCATEGORIES, setPaymentMethods } from '../constants'
import { configStore } from '../store/configStore'
import { defaultAccount, updateTradingLimit } from '../utils/account'
import { error } from '../utils/log'
import { shouldUsePaymentMethod } from '../utils/paymentMethod'
import { getInfo, getTradingLimit } from '../utils/peachAPI'
import { isRejectedPromise } from '../utils/promise'
import { calculateClientServerTimeDifference } from './calculateClientServerTimeDifference'

const storePeachInfo = (peachInfo: GetInfoResponse) => {
  const {
    setPaymentMethods: setPaymentMethodsStore,
    setLatestAppVersion,
    setMinAppVersion,
    setPeachFee,
    setPeachPGPPublicKey,
  } = configStore.getState()

  const paymentMethods = peachInfo.paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES))
  setPeachPGPPublicKey(peachInfo.peach.pgpPublicKey)
  setPaymentMethodsStore(paymentMethods)
  setPaymentMethods(paymentMethods)
  setPeachFee(peachInfo.fees.escrow)
  setLatestAppVersion(peachInfo.latestAppVersion)
  setMinAppVersion(peachInfo.minAppVersion)
}

/**
 * @description Method to fetch peach info and user trading limit and store values in constants
 */
export const getPeachInfo = async (account?: Account) => {
  const { paymentMethods } = configStore.getState()

  const statusResponse = await calculateClientServerTimeDifference()
  if (!statusResponse || statusResponse.error) {
    error('Server not available', statusResponse)
    setPaymentMethods(paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES)))
    return statusResponse
  }

  const [peachInfoResponse, tradingLimitResponse] = await Promise.allSettled([
    getInfo({ timeout: 5000 }),
    account?.publicKey ? getTradingLimit({ timeout: 5000 }) : [defaultAccount.tradingLimit, null],
  ])

  if (isRejectedPromise(peachInfoResponse)) {
    error('Error fetching peach info', peachInfoResponse.reason)
    setPaymentMethods(paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES)))
  } else if (peachInfoResponse.value[0]) {
    storePeachInfo(peachInfoResponse.value[0])
  }

  if (isRejectedPromise(tradingLimitResponse)) {
    error('Error fetching trading limit', tradingLimitResponse.reason)
  } else if (tradingLimitResponse.value[0]) {
    updateTradingLimit(tradingLimitResponse.value[0])
  }

  return statusResponse
}
