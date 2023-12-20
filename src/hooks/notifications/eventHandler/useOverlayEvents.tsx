import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { overlayAtom } from '../../../App'
import { NewBadge } from '../../../views/overlays/NewBadge'
import { useNavigation } from '../../useNavigation'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

export const useOverlayEvents = () => {
  const navigation = useNavigation()
  const [, setOverlayContent] = useAtom(overlayAtom)

  const overlayEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-U01
      'user.badge.unlocked': ({ badges }: PNData) => {
        if (badges) {
          setOverlayContent(<NewBadge badges={badges.split(',') as Medal[]} />)
        }
      },
      // PN-S03
      'offer.escrowFunded': ({ offerId }: PNData) =>
        offerId ? navigation.navigate('offerPublished', { offerId, shouldGoBack: true }) : undefined,
      // PN-S11
      'contract.paymentMade': ({ contractId }: PNData) =>
        contractId ? navigation.navigate('paymentMade', { contractId }) : undefined,
    }),
    [navigation, setOverlayContent],
  )
  return overlayEvents
}
