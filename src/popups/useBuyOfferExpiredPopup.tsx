import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../components/popup/PopupAction'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useNavigation } from '../hooks/useNavigation'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { BuyOfferExpired } from './BuyOfferExpired'
import { ClosePopupAction } from './actions/ClosePopupAction'

export const useBuyOfferExpiredPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const goToContact = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [closePopup, navigation])

  const buyOfferExpiredPopup = useCallback(
    (offerId: string, days: string) => {
      setPopup(
        <PopupComponent
          title={i18n('notification.offer.buyOfferExpired.title')}
          content={<BuyOfferExpired {...{ offerId, days }} />}
          actions={
            <>
              <PopupAction label={i18n('help')} iconId="helpCircle" onPress={goToContact} />
              <ClosePopupAction reverseOrder />
            </>
          }
        />,
      )
    },
    [goToContact, setPopup],
  )
  return buyOfferExpiredPopup
}
