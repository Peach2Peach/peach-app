import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { CancelOffer } from '../popups/CancelOffer'
import { GrayPopup } from '../popups/GrayPopup'
import { ClosePopupAction } from '../popups/actions'
import { LoadingPopupAction } from '../popups/actions/LoadingPopupAction'
import { useStartRefundPopup } from '../popups/useStartRefundPopup'
import { usePopupStore } from '../store/usePopupStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { cancelAndSaveOffer } from '../utils/offer/cancelAndSaveOffer'
import { isBuyOffer } from '../utils/offer/isBuyOffer'
import { useNavigation } from './useNavigation'
import { useShowErrorBanner } from './useShowErrorBanner'

export const useCancelOffer = (offer: BuyOffer | SellOffer | null | undefined) => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const cancelOffer = useCallback(() => {
    if (!offer) return
    setPopup(<CancelOfferPopup offer={offer} />)
  }, [offer, setPopup])

  return cancelOffer
}

function CancelOfferPopup ({ offer }: { offer: BuyOffer | SellOffer }) {
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const queryClient = useQueryClient()

  const showOfferCanceled = useCallback(() => {
    setPopup(
      <GrayPopup title={i18n('offer.canceled.popup.title')} actions={<ClosePopupAction style={tw`justify-center`} />} />,
    )
  }, [setPopup])

  const startRefund = useStartRefundPopup()

  const confirmCancelOffer = useCallback(async () => {
    if (!offer) return
    const [cancelResult, cancelError] = await cancelAndSaveOffer(offer)

    if (!cancelResult || cancelError) {
      showError(cancelError?.error)
      return
    }

    if (isBuyOffer(offer) || offer.funding.status === 'NULL' || offer.funding.txIds.length === 0) {
      showOfferCanceled()
      navigation.replace('homeScreen', { screen: 'home' })
    } else {
      startRefund(offer)
    }
    queryClient.refetchQueries({ queryKey: ['offerSummaries'] })
  }, [navigation, offer, queryClient, showError, showOfferCanceled, startRefund])

  return (
    <PopupComponent
      title={i18n('offer.cancel.popup.title')}
      content={<CancelOffer type={offer.type} />}
      actionBgColor={tw`bg-black-3`}
      bgColor={tw`bg-primary-background-light`}
      actions={
        <>
          <PopupAction label={i18n('neverMind')} iconId="arrowLeftCircle" onPress={closePopup} />
          <LoadingPopupAction label={i18n('cancelOffer')} iconId="xCircle" onPress={confirmCancelOffer} reverseOrder />
        </>
      }
    />
  )
}
