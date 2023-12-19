import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../../components/popup/PopupAction'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { useNavigation } from '../../../hooks/useNavigation'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { OfferRepublished } from '../../../popups/tradeCancelation'
import { usePopupStore } from '../../../store/usePopupStore'
import { getSellOfferFromContract } from '../../../utils/contract/getSellOfferFromContract'
import i18n from '../../../utils/i18n'
import { peachAPI } from '../../../utils/peachAPI'

export const useRepublishOffer = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showErrorBanner = useShowErrorBanner()
  const navigation = useNavigation()

  const republishOffer = useCallback(
    async (contract: Contract) => {
      const sellOffer = getSellOfferFromContract(contract)

      const { result: reviveSellOfferResult, error: err } = await peachAPI.private.offer.republishSellOffer({
        offerId: sellOffer.id,
      })
      if (!reviveSellOfferResult || err) {
        showErrorBanner(err?.error)
        closePopup()
        return
      }

      const closeAction = () => {
        navigation.replace('contract', { contractId: contract.id })
        closePopup()
      }
      const goToOfferAction = () => {
        navigation.replace('search', { offerId: reviveSellOfferResult.newOfferId })
        closePopup()
      }

      setPopup(
        <PopupComponent
          title={i18n('contract.cancel.offerRepublished.title')}
          content={<OfferRepublished />}
          actions={
            <>
              <PopupAction label={i18n('close')} iconId="xSquare" onPress={closeAction} />
              <PopupAction label={i18n('goToOffer')} iconId="arrowRightCircle" onPress={goToOfferAction} reverseOrder />
            </>
          }
        />,
      )
    },
    [closePopup, navigation, setPopup, showErrorBanner],
  )

  return republishOffer
}
