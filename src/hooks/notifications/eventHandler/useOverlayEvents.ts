import { useMemo } from 'react'
import { useNavigation } from '../../useNavigation'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

export const useOverlayEvents = () => {
  const navigation = useNavigation()

  const overlayEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-U01
      'user.badge.unlocked': ({ badges }: PNData) => navigation.navigate('newBadge', { badges }),
      // PN-S03
      'offer.escrowFunded': ({ offerId }: PNData) =>
        offerId ? navigation.navigate('offerPublished', { isSellOffer: true, shouldGoBack: true }) : null,
    }),
    [navigation],
  )
  return overlayEvents
}
