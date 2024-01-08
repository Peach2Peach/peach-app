import i18n from '../../../utils/i18n'
import { useClosePopup } from '../Popup'
import { PopupAction, PopupActionProps } from '../PopupAction'

type Props = Pick<PopupActionProps, 'textStyle' | 'reverseOrder' | 'style'>

export const ClosePopupAction = (props: Props) => {
  const closePopup = useClosePopup()
  return <PopupAction onPress={closePopup} label={i18n('close')} iconId={'xSquare'} {...props} />
}
