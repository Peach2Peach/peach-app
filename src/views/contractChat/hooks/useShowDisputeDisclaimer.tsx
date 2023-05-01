import { useCallback, useContext } from 'react'
import { Text } from '../../../components/text'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useConfigStore } from '../../../store/configStore'
import { DisputeDisclaimer } from '../../../overlays/info/DisputeDisclaimer'

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
