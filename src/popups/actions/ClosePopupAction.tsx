import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'
import { PopupAction } from '../../components/popup'

export const ClosePopupAction = () => {
  const closePopup = usePopupStore((state) => state.closePopup)
  return <PopupAction onPress={closePopup} label={i18n('close')} iconId={'xSquare'} />
}
