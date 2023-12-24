import { useCallback } from 'react'
import { useClosePopup } from '../components/popup/Popup'
import { PopupAction } from '../components/popup/PopupAction'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useNavigation } from '../hooks/useNavigation'
import i18n from '../utils/i18n'
import { BuyOfferExpired } from './BuyOfferExpired'
import { ClosePopupAction } from './actions/ClosePopupAction'

export function BuyOfferExpiredPopup ({ offerId, days }: { offerId: string; days: string }) {
  const closePopup = useClosePopup()
  const navigation = useNavigation()
  const goToContact = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [closePopup, navigation])

  return (
    <PopupComponent
      title={i18n('notification.offer.buyOfferExpired.title')}
      content={<BuyOfferExpired {...{ offerId, days }} />}
      actions={
        <>
          <PopupAction label={i18n('help')} iconId="helpCircle" onPress={goToContact} />
          <ClosePopupAction reverseOrder />
        </>
      }
    />
  )
}
