import { PopupAction } from '../../components/popup'
import { PopupActionProps } from '../../components/popup/PopupAction'
import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'

type Props = Pick<PopupActionProps, 'textStyle' | 'reverseOrder' | 'style'>

export const ClosePopupAction = (props: Props) => {
  const closePopup = usePopupStore((state) => state.closePopup)
  return <PopupAction onPress={closePopup} label={i18n('close')} iconId={'xSquare'} {...props} />
}
