import { error } from '../../../utils/log'
import { unmatchOffer } from '../../../utils/peachAPI'

export const unmatchFn = async (
  offerId: string | undefined,
  matchingOfferId: string,
  updateMessage: (value: MessageState) => void,
) => {
  if (!offerId) throw new Error()
  const [result, err] = await unmatchOffer({ offerId, matchingOfferId })
  if (result) {
    return result
  }
  error('Error', err)
  updateMessage({
    msgKey: err?.error || 'error.general',
    level: 'ERROR',
  })
  throw new Error()
}
