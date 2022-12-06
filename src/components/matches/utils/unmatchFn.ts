import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log'
import { StackNavigation } from '../../../utils/navigation'
import { unmatchOffer } from '../../../utils/peachAPI'

export const unmatchFn = async (
  offerId: string | undefined,
  matchingOfferId: string,
  updateMessage: (value: MessageState) => void,
  navigation: StackNavigation,
  // eslint-disable-next-line max-params
) => {
  if (!offerId) throw new Error()
  const [result, err] = await unmatchOffer({ offerId, matchingOfferId })
  if (result) {
    return result
  }
  error('Error', err)
  updateMessage({
    msgKey: err?.error || 'GENERAL_ERROR',
    level: 'ERROR',
    action: () => navigation.navigate('contact', {}),
    actionLabel: i18n('contactUs'),
    actionIcon: 'mail',
  })
  throw new Error()
}
