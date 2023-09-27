import { setClientServerTimeDifference } from '../constants'
import { getAbortWithTimeout } from '../utils/getAbortWithTimeout'
import { error } from '../utils/log'
import { peachAPI } from '../utils/peachAPI'

/**
 * Note: we estimate the time it took for the response to arrive from server to client
 * by dividing the round trip time in half
 * This is only an estimation as round trips are often asymmetric
 */
export const calculateClientServerTimeDifference = async (): Promise<GetStatusResponse | undefined> => {
  const start = Date.now()
  const { result: peachStatusResponse, error: peachStatusErr } = await peachAPI.public.system.getStatus({
    signal: getAbortWithTimeout(2000).signal,
  })
  const end = Date.now()
  const roundTrip = (end - start) / 2

  if (!peachStatusResponse || peachStatusErr) {
    error('Error peach server info', JSON.stringify(peachStatusErr))
    return undefined
  }

  setClientServerTimeDifference(end - roundTrip - peachStatusResponse.serverTime)
  return peachStatusResponse
}
