import { useCallback, useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useContractStore } from '../../store/contractStore'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'
import { reviveSellOffer } from '../../utils/peachAPI'
import { useStartRefundOverlay } from '../useStartRefundOverlay'
import { BuyerConfirmedCancelTrade } from './BuyerConfirmedCancelTrade'
import { ContractCanceledToSeller } from './ContractCanceledToSeller'
import { OfferRepublished } from './OfferRepublished'

export const useTradeCanceledOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const updateContract = useContractStore((state) => state.updateContract)
  const startRefund = useStartRefundOverlay()
  const showError = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const confirmOverlay = useCallback(
    (contract: Contract) => {
      closeOverlay()
      updateContract(contract.id, {
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [closeOverlay, updateContract],
  )

  const republishOffer = useCallback(
    async (sellOffer: SellOffer, contract: Contract) => {
      const [reviveSellOfferResult, err] = await reviveSellOffer({ offerId: sellOffer.id })

      if (!reviveSellOfferResult || err) {
        showError(err?.error)
        closeOverlay()
        return
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
          callback: () => {
            navigation.replace('search', { offerId: reviveSellOfferResult.newOfferId })
            confirmOverlay(contract)
          },
        },
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            navigation.replace('contract', { contractId: contract.id })
            confirmOverlay(contract)
          },
        },
      })
    },
    [closeOverlay, confirmOverlay, navigation, showError, updateOverlay],
  )

  const showTradeCanceled = useCallback(
    (contract: Contract, mutualClose: boolean) => {
      const sellOffer = getSellOfferFromContract(contract)
      if (!sellOffer) return

      navigation.navigate('yourTrades', { tab: 'history' })
      const expiry = getOfferExpiry(sellOffer)
      const refundAction = {
        label: i18n('contract.cancel.tradeCanceled.refund'),
        icon: 'download',
        callback: () => {
          confirmOverlay(contract)
          startRefund(sellOffer)
        },
      }
      const action1 = expiry.isExpired
        ? refundAction
        : {
          label: i18n('contract.cancel.tradeCanceled.republish'),
          icon: 'refreshCw',
          callback: () => republishOffer(sellOffer, contract),
        }
      const action2 = expiry.isExpired ? undefined : refundAction

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
    },
    [confirmOverlay, navigation, republishOffer, startRefund, updateOverlay],
  )

  return showTradeCanceled
}
