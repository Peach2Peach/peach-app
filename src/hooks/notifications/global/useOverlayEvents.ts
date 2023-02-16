import { useMemo } from 'react'
import { useNavigation } from '../../useNavigation'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

export const useOverlayEvents = () => {
  const navigation = useNavigation()

  const overlayEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S03
      'offer.escrowFunded': ({ offerId }: PNData) =>
        offerId ? navigation.navigate('offerPublished', { offerId, shouldGoBack: true }) : null,
    }),
    [navigation],
  )
  return overlayEvents
}
