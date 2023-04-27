import { usePopupStore } from '../store/usePopupStore'
import { PopupContent } from './PopupContent'

export const Popup = () => {
  const popupState = usePopupStore()

  return <PopupContent {...popupState} />
}
