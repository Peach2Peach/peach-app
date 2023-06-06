import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../hooks'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { OfferOutsideRange } from './OfferOutsideRange'

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
      setPopup({
        title: i18n('notification.offer.outsideRange.title'),
        content: <OfferOutsideRange {...{ offerId }} />,
        visible: true,
        level: 'APP',
        action1: {
          label: i18n('goToOffer'),
          icon: 'arrowLeftCircle',
          callback: () => goToOffer(offerId),
        },
        action2: {
          label: 'close',
          icon: 'xSquare',
          callback: closePopup,
        },
      })
    },
    [closePopup, goToOffer, setPopup],
  )
  return buyOfferExpiredPopup
}
