import { useMemo } from 'react'
import { useSetOverlay } from '../../../Overlay'
import { PaymentMade } from '../../../views/contract/PaymentMade'
import { NewBadge } from '../../../views/overlays/NewBadge'
import { OfferPublished } from '../../../views/search/OfferPublished'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

export const useOverlayEvents = () => {
  const setOverlayContent = useSetOverlay()

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
        offerId ? setOverlayContent(<OfferPublished offerId={offerId} shouldGoBack />) : undefined,
      // PN-S11
      'contract.paymentMade': ({ contractId }: PNData) =>
        contractId ? setOverlayContent(<PaymentMade contractId={contractId} />) : undefined,
    }),
    [setOverlayContent],
  )
  return overlayEvents
}
