import { useMemo } from 'react'
import { useNavigation } from '../../useNavigation'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

export const useOverlayEvents = () => {
  const navigation = useNavigation()

  const overlayEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-U01
      'user.badge.unlocked': ({ badges }: PNData) => (badges ? navigation.navigate('newBadge', { badges }) : undefined),
      // PN-S03
      'offer.escrowFunded': ({ offerId }: PNData) =>
        offerId ? navigation.navigate('offerPublished', { offerId, shouldGoBack: true }) : undefined,
      // PN-S11
      'contract.paymentMade': ({ contractId }: PNData) =>
        contractId ? navigation.navigate('paymentMade', { contractId }) : undefined,
    }),
    [navigation],
  )
  return overlayEvents
}
