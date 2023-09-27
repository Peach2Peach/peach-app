import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { usePopupStore } from '../../store/usePopupStore'
import { getSellOfferFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'
import { peachAPI } from '../../utils/peachAPI'
import { useStartRefundPopup } from '../useStartRefundPopup'
import { BuyerConfirmedCancelTrade } from './BuyerConfirmedCancelTrade'
import { ContractCanceledToSeller } from './ContractCanceledToSeller'
import { OfferRepublished } from './OfferRepublished'

export const useTradeCanceledPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const startRefund = useStartRefundPopup()
  const showErrorBanner = useShowErrorBanner()
  const navigation = useNavigation()

  const confirmPopup = useCallback(
    (contract: Contract) => {
      closePopup()
      saveContract({
        ...contract,
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [closePopup],
  )

  const republishOffer = useCallback(
    async (sellOffer: SellOffer, contract: Contract) => {
      const { result: reviveSellOfferResult, error: err } = await peachAPI.private.offer.republishSellOffer({
        offerId: sellOffer.id,
      })

      const closeAction = () => {
        navigation.replace('contract', { contractId: contract.id })
        confirmPopup(contract)
      }
      const goToOfferAction = () => {
        if (!reviveSellOfferResult) return
        navigation.replace('search', { offerId: reviveSellOfferResult.newOfferId })
        confirmPopup(contract)
      }
      if (!reviveSellOfferResult || err) {
        showErrorBanner(err?.error)
        closePopup()
        return
      }

      setPopup({
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
    },
    [closePopup, confirmPopup, navigation, setPopup, showErrorBanner],
  )

  const showTradeCanceled = useCallback(
    (contract: Contract, mutualClose: boolean) => {
      const sellOffer = getSellOfferFromContract(contract)

      const refundAction = () => {
        confirmPopup(contract)
        startRefund(sellOffer)
      }
      const republishAction = () => republishOffer(sellOffer, contract)

      if (!sellOffer || sellOffer.refunded || sellOffer.released || sellOffer.newOfferId) {
        return { refundAction, republishAction }
      }

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

      setPopup({
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
        level: 'DEFAULT',
        requireUserAction: true,
        action1,
        action2,
      })

      return { republishAction, refundAction }
    },
    [confirmPopup, navigation, republishOffer, setPopup, startRefund],
  )

  return { showTradeCanceled, republishOffer, confirmPopup }
}
