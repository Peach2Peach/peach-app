import { useCallback } from 'react'
import { PopupAction } from '../../components/popup'
import { useNavigation } from '../../hooks'
import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'

export function HelpPopupAction () {
  const navigation = useNavigation()
  const closePopup = usePopupStore((state) => state.closePopup)
  const goToHelp = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [navigation, closePopup])
  return <PopupAction label={i18n('help')} iconId="info" onPress={goToHelp} />
}
