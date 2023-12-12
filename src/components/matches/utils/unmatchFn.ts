import { error } from '../../../utils/log'
import { peachAPI } from '../../../utils/peachAPI'

export const unmatchFn = async (
  offerId: string | undefined,
  matchingOfferId: string,
  updateMessage: (value: MessageState) => void,
) => {
  if (!offerId) throw new Error()
  const { result, error: err } = await peachAPI.private.offer.unmatchOffer({ offerId, matchingOfferId })
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
