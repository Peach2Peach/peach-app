import { useCallback } from 'react'
import { useOverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { getSellOfferFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'
import { reviveSellOffer } from '../../utils/peachAPI'
import { useStartRefundOverlay } from '../useStartRefundOverlay'
import { BuyerConfirmedCancelTrade } from './BuyerConfirmedCancelTrade'
import { ContractCanceledToSeller } from './ContractCanceledToSeller'
import { OfferRepublished } from './OfferRepublished'

export const useTradeCanceledOverlay = () => {
  const [, updateOverlay] = useOverlayContext()
  const startRefund = useStartRefundOverlay()
  const showErrorBanner = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const confirmOverlay = useCallback(
    (contract: Contract) => {
      closeOverlay()
      saveContract({
        ...contract,
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [closeOverlay],
  )

  const republishOffer = useCallback(
    async (sellOffer: SellOffer, contract: Contract) => {
      const [reviveSellOfferResult, err] = await reviveSellOffer({ offerId: sellOffer.id })

      const closeAction = () => {
        navigation.replace('contract', { contractId: contract.id })
        confirmOverlay(contract)
      }
      const goToOfferAction = () => {
        if (!reviveSellOfferResult) return
        navigation.replace('search', { offerId: reviveSellOfferResult.newOfferId })
        confirmOverlay(contract)
      }
      if (!reviveSellOfferResult || err) {
        showErrorBanner(err?.error)
        closeOverlay()
        return { closeAction, goToOfferAction }
      }

      updateOverlay({
        title: i18n('contract.cancel.offerRepublished.title'),
        content: <OfferRepublished />,
        visible: true,
        level: 'APP',
        requireUserAction: true,
        action1: {
          label: i18n('goToOffer'),
          icon: 'arrowRightCircle',
          callback: goToOfferAction,
        },
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: closeAction,
        },
      })

      return { closeAction, goToOfferAction }
    },
    [closeOverlay, confirmOverlay, navigation, showErrorBanner, updateOverlay],
  )

  const showTradeCanceled = useCallback(
    (contract: Contract, mutualClose: boolean) => {
      const sellOffer = getSellOfferFromContract(contract)

      const refundAction = () => {
        confirmOverlay(contract)
        startRefund(sellOffer)
      }
      const republishAction = () => republishOffer(sellOffer, contract)

      if (!sellOffer) return { refundAction, republishAction }

      navigation.navigate('yourTrades', { tab: 'history' })
      const expiry = getOfferExpiry(sellOffer)

      const refundActionObject = {
        label: i18n('contract.cancel.tradeCanceled.refund'),
        icon: 'download',
        callback: refundAction,
      }
      const action1 = expiry.isExpired
        ? refundActionObject
        : {
          label: i18n('contract.cancel.tradeCanceled.republish'),
          icon: 'refreshCw',
          callback: republishAction,
        }
      const action2 = expiry.isExpired ? undefined : refundActionObject

      updateOverlay({
        title: i18n(
          mutualClose
            ? 'contract.cancel.buyerConfirmed.title'
            : `contract.cancel.${contract.canceledBy || 'buyer'}.canceled.title`,
        ),
        content: mutualClose ? (
          <BuyerConfirmedCancelTrade contract={contract} />
        ) : (
          <ContractCanceledToSeller contract={contract} />
        ),
        visible: true,
        level: 'WARN',
        requireUserAction: true,
        action1,
        action2,
      })

      return { republishAction, refundAction }
    },
    [confirmOverlay, navigation, republishOffer, startRefund, updateOverlay],
  )

  return { showTradeCanceled, republishOffer, confirmOverlay }
}
