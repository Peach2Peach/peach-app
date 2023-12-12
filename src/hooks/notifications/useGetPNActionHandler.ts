import { useCallback } from 'react'
import i18n from '../../utils/i18n'
import { useNavigation } from '../useNavigation'

const offerSummaryEvents = ['offer.notFunded', 'offer.sellOfferExpired', 'offer.buyOfferExpired']
const searchEvents = ['offer.matchSeller']
const exploreEvents = ['offer.matchBuyer']

export const useGetPNActionHandler = () => {
  const navigation = useNavigation()
  const getPNActionHandler = useCallback(
    ({ type, contractId, isChat, offerId }: PNData): Action | undefined => {
      if (contractId && isChat) return {
        label: i18n('goToChat'),
        icon: 'arrowLeftCircle',
        callback: () => navigation.navigate('contractChat', { contractId }),
      }
      if (contractId) return {
        label: i18n('goToContract'),
        icon: 'arrowLeftCircle',
        callback: () => navigation.navigate('contract', { contractId }),
      }
      if (offerId && type && offerSummaryEvents.includes(type)) return {
        label: i18n('goToOffer'),
        icon: 'arrowLeftCircle',
        callback: () => navigation.navigate('offer', { offerId }),
      }
      if (offerId && type && searchEvents.includes(type)) return {
        label: i18n('goToOffer'),
        icon: 'arrowLeftCircle',
        callback: () => navigation.navigate('search', { offerId }),
      }
      if (offerId && type && exploreEvents.includes(type)) return {
        label: i18n('goToOffer'),
        icon: 'arrowLeftCircle',
        callback: () => navigation.navigate('explore', { offerId }),
      }
      return undefined
    },
    [navigation],
  )
  return getPNActionHandler
}
