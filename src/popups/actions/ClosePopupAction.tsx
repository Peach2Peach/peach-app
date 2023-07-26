import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'
import { PopupAction } from '../../components/popup'
import { TextStyle } from 'react-native'

type Props = {
  textStyle?: TextStyle
}

export const ClosePopupAction = ({ textStyle }: Props) => {
  const closePopup = usePopupStore((state) => state.closePopup)
  return <PopupAction onPress={closePopup} label={i18n('close')} iconId={'xSquare'} textStyle={textStyle} />
}
