import { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import { helpOverlays } from '../overlays/showHelp'
import i18n from '../utils/i18n'

export const useShowHelp = (id: HelpType) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const showHelp = useCallback(() => {
    const goToHelp = () => {
      updateOverlay({
        visible: false,
      })
      navigation.navigate('contact')
    }

    updateOverlay({
      title: helpOverlays.title[id],
      content: helpOverlays.content[id],
      visible: true,
      action2: {
        callback: goToHelp,
        label: i18n('help'),
        icon: 'info',
      },
      level: 'INFO',
    })
  }, [id, navigation, updateOverlay])

  return showHelp
}
