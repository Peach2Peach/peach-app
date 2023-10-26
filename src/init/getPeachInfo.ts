import { PAYMENTCATEGORIES, setPaymentMethods } from '../paymentMethods'
import { useConfigStore } from '../store/configStore'
import { usePaymentDataStore } from '../store/usePaymentDataStore'
import { error } from '../utils/log'
import { shouldUsePaymentMethod } from '../utils/paymentMethod'
import { getInfo } from '../utils/peachAPI'
import { calculateClientServerTimeDifference } from './calculateClientServerTimeDifference'
import { storePeachInfo } from './storePeachInfo'

const setPaymentMethodsFromStore = () => {
  setPaymentMethods(useConfigStore.getState().paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES)))
}

export const getPeachInfo = async (): Promise<GetStatusResponse | APIError | null> => {
  if (!useConfigStore.persist.hasHydrated() || !usePaymentDataStore.persist.hasHydrated()) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return getPeachInfo()
  }
  const statusResponse = await calculateClientServerTimeDifference()
  if (!statusResponse || statusResponse.error) {
    error('Server not available', statusResponse)
    setPaymentMethodsFromStore()
    return statusResponse
  }

  const [getInfoResponse, getInfoError] = await getInfo({ timeout: 5000 })

  if (getInfoError) {
    error('Error fetching peach info', getInfoError.error)
    setPaymentMethodsFromStore()
  } else if (getInfoResponse) {
    storePeachInfo(getInfoResponse)
  }

  return statusResponse
}
