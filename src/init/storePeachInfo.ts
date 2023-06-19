import { PAYMENTCATEGORIES, setPaymentMethods } from '../constants'
import { useConfigStore } from '../store/configStore'
import { shouldUsePaymentMethod } from '../utils/paymentMethod'

export const storePeachInfo = (peachInfo: GetInfoResponse) => {
  const {
    setPaymentMethods: setPaymentMethodsStore,
    setLatestAppVersion,
    setMinAppVersion,
    setPeachFee,
    setPeachPGPPublicKey,
  } = useConfigStore.getState()

  const paymentMethods = peachInfo.paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES))
  setPeachPGPPublicKey(peachInfo.peach.pgpPublicKey)
  setPaymentMethodsStore(paymentMethods)
  setPaymentMethods(paymentMethods)
  setPeachFee(peachInfo.fees.escrow)
  setLatestAppVersion(peachInfo.latestAppVersion)
  setMinAppVersion(peachInfo.minAppVersion)
}
