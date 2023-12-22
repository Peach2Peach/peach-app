import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useNavigation } from '../hooks/useNavigation'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { OfferOutsideRange } from './OfferOutsideRange'
import { ClosePopupAction } from './actions/ClosePopupAction'

export const useOfferOutsideRangePopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const goToOffer = useCallback(
    (offerId: string) => {
      closePopup()
      navigation.navigate('offer', { offerId })
    },
    [closePopup, navigation],
  )

  const buyOfferExpiredPopup = useCallback(
    (offerId: string) => {
      setPopup(
        <PopupComponent
          title={i18n('notification.offer.outsideRange.title')}
          content={<OfferOutsideRange {...{ offerId }} />}
          actions={
            <>
              <ClosePopupAction />
              <PopupAction
                label={i18n('goToOffer')}
                iconId="arrowLeftCircle"
                onPress={() => goToOffer(offerId)}
                reverseOrder
              />
            </>
          }
        />,
      )
    },
    [goToOffer, setPopup],
  )
  return buyOfferExpiredPopup
}
