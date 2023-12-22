import { useCallback } from 'react'
import { useClosePopup, useSetPopup } from '../components/popup/Popup'
import { PopupAction } from '../components/popup/PopupAction'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useNavigation } from '../hooks/useNavigation'
import i18n from '../utils/i18n'
import { BuyOfferExpired } from './BuyOfferExpired'
import { ClosePopupAction } from './actions/ClosePopupAction'

export const useBuyOfferExpiredPopup = () => {
  const setPopup = useSetPopup()
  const closePopup = useClosePopup()
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
