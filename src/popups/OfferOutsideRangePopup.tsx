import { PopupAction } from '../components/popup'
import { useClosePopup } from '../components/popup/Popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { useNavigation } from '../hooks/useNavigation'
import i18n from '../utils/i18n'
import { OfferOutsideRange } from './OfferOutsideRange'
import { ClosePopupAction } from './actions/ClosePopupAction'

export function OfferOutsideRangePopup ({ offerId }: { offerId: string }) {
  const closePopup = useClosePopup()
  const navigation = useNavigation()
  const goToOffer = () => {
    closePopup()
    navigation.navigate('offer', { offerId })
  }

  return (
    <PopupComponent
      title={i18n('notification.offer.outsideRange.title')}
      content={<OfferOutsideRange offerId={offerId} />}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction label={i18n('goToOffer')} iconId="arrowLeftCircle" onPress={goToOffer} reverseOrder />
        </>
      }
    />
  )
}
