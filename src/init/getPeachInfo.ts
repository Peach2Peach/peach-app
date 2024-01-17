import { APIError } from '../../peach-api/src/@types/global'
import { MSINASECOND } from '../constants'
import { PAYMENTCATEGORIES, setPaymentMethods } from '../paymentMethods'
import { useConfigStore } from '../store/configStore/configStore'
import { usePaymentDataStore } from '../store/usePaymentDataStore'
import { getAbortWithTimeout } from '../utils/getAbortWithTimeout'
import { error } from '../utils/log/error'
import { shouldUsePaymentMethod } from '../utils/paymentMethod/shouldUsePaymentMethod'
import { peachAPI } from '../utils/peachAPI'
import { calculateClientServerTimeDifference } from './calculateClientServerTimeDifference'
import { storePeachInfo } from './storePeachInfo'

const setPaymentMethodsFromStore = () => {
  setPaymentMethods(useConfigStore.getState().paymentMethods.filter(shouldUsePaymentMethod(PAYMENTCATEGORIES)))
}

export const getPeachInfo = async (): Promise<
  GetStatusResponse | APIError<'HUMAN_VERIFICATION_REQUIRED'> | null | undefined
> => {
  if (!useConfigStore.persist.hasHydrated() || !usePaymentDataStore.persist.hasHydrated()) {
    await new Promise((resolve) => setTimeout(resolve, MSINASECOND))
    return getPeachInfo()
  }
  const statusResponse = await calculateClientServerTimeDifference()
  if (!statusResponse || statusResponse.error) {
    error('Server not available', statusResponse)
    setPaymentMethodsFromStore()
    return statusResponse
  }

  const { result: getInfoResponse, error: getInfoError } = await peachAPI.public.system.getInfo({
    signal: getAbortWithTimeout(5 * MSINASECOND).signal,
  })

  if (getInfoError) {
    error('Error fetching peach info', getInfoError.error)
    setPaymentMethodsFromStore()
  } else if (getInfoResponse) {
    storePeachInfo(getInfoResponse)
  }

  return statusResponse
}
