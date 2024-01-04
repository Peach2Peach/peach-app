import { PopupAction } from '../../components/popup'
import { useClosePopup } from '../../components/popup/Popup'
import { PopupActionProps } from '../../components/popup/PopupAction'
import i18n from '../../utils/i18n'

type Props = Pick<PopupActionProps, 'textStyle' | 'reverseOrder' | 'style'>

export const ClosePopupAction = (props: Props) => {
  const closePopup = useClosePopup()
  return <PopupAction onPress={closePopup} label={i18n('close')} iconId={'xSquare'} {...props} />
}
