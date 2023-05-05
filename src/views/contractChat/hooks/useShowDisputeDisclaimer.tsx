import { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { DisputeDisclaimer } from '../../../overlays/info/DisputeDisclaimer'
import { useConfigStore } from '../../../store/configStore'
import i18n from '../../../utils/i18n'

export const useShowDisputeDisclaimer = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const setSeenDisputeDisclaimer = useConfigStore((state) => state.setSeenDisputeDisclaimer)

  const showDisputeDisclaimer = useCallback(async () => {
    const goToHelp = () => {
      setSeenDisputeDisclaimer(true)
      updateOverlay({ visible: false })
      navigation.navigate('contact')
    }
    const close = () => {
      setSeenDisputeDisclaimer(true)
      updateOverlay({ visible: false })
    }
    updateOverlay({
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
  }, [navigation, setSeenDisputeDisclaimer, updateOverlay])
  return showDisputeDisclaimer
}
