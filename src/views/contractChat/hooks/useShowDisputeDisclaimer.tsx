import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { DisputeDisclaimer } from '../../../overlays/info/DisputeDisclaimer'
import { useConfigStore } from '../../../store/configStore'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'

export const useShowDisputeDisclaimer = () => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const setSeenDisputeDisclaimer = useConfigStore((state) => state.setSeenDisputeDisclaimer)

  const showDisputeDisclaimer = useCallback(async () => {
    const goToHelp = () => {
      setSeenDisputeDisclaimer(true)
      closePopup()
      navigation.navigate('contact')
    }
    const close = () => {
      setSeenDisputeDisclaimer(true)
      closePopup()
    }
    setPopup({
      title: i18n('trade.chat'),
      level: 'INFO',
      content: <DisputeDisclaimer />,
      visible: true,
      action1: {
        callback: close,
        label: i18n('close'),
        icon: 'xSquare',
      },
      action2: {
        callback: goToHelp,
        label: i18n('help'),
        icon: 'info',
      },
    })
  }, [closePopup, navigation, setPopup, setSeenDisputeDisclaimer])
  return showDisputeDisclaimer
}
