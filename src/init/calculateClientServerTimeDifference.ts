import { setClientServerTimeDifference } from '../constants'
import { error } from '../utils/log'
import { getStatus } from '../utils/peachAPI'

/**
 * Note: we estimate the time it took for the response to arrive from server to client
 * by dividing the round trip time in half
 * This is only an estimation as round trips are often asymmetric
 */
export const calculateClientServerTimeDifference = async (): Promise<GetStatusResponse | APIError | null> => {
  const start = Date.now()
  const [peachStatusResponse, peachStatusErr] = await getStatus({})
  const end = Date.now()
  const roundTrip = (end - start) / 2

  if (!peachStatusResponse || peachStatusErr) {
    error('Error peach server info', JSON.stringify(peachStatusErr))
    return peachStatusErr
  }

  setClientServerTimeDifference(end - roundTrip - peachStatusResponse.serverTime)
  return peachStatusResponse || peachStatusErr
}
