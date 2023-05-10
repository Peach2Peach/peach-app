import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../hooks'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { BuyOfferExpired } from './BuyOfferExpired'

export const useBuyOfferExpiredOverlay = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const goToContact = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [closePopup, navigation])

  const buyOfferExpiredOverlay = useCallback(
    (offerId: string, days: string) => {
      setPopup({
        title: i18n('notification.offer.buyOfferExpired.title'),
        content: <BuyOfferExpired {...{ offerId, days }} />,
        visible: true,
        level: 'APP',
        action1: {
          label: 'close',
          icon: 'xSquare',
          callback: closePopup,
        },
        action2: {
          label: i18n('help'),
          icon: 'helpCircle',
          callback: goToContact,
        },
      })
    },
    [closePopup, goToContact, setPopup],
  )
  return buyOfferExpiredOverlay
}
