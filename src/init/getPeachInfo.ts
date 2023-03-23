import { PAYMENTCATEGORIES, setPaymentMethods } from '../constants'
import { configStore } from '../store/configStore'
import { error } from '../utils/log'
import { shouldUsePaymentMethod } from '../utils/paymentMethod'
import { getInfo } from '../utils/peachAPI'
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

export const getPeachInfo = async () => {
  const { paymentMethods } = configStore.getState()

  const statusResponse = await calculateClientServerTimeDifference()
  if (!statusResponse || statusResponse.error) {
    error('Server not available', statusResponse)
    setPaymentMethods(paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES)))
    return statusResponse
  }

  const [getInfoResponse, getInfoError] = await getInfo({ timeout: 5000 })

  if (getInfoError) {
    error('Error fetching peach info', getInfoError.error)
    setPaymentMethods(paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES)))
  } else if (getInfoResponse) {
    storePeachInfo(getInfoResponse)
  }

  return statusResponse
}
