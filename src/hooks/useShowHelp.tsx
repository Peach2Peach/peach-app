import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../hooks'
import { HelpType, helpPopups } from '../popups/helpPopups'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'

export const useShowHelp = (id: HelpType) => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const goToHelp = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [navigation, closePopup])

  const showHelp = useCallback(
    (otherId?: HelpType) => {
      const Content = helpPopups[otherId || id].content

      setPopup({
        title: helpPopups[id].title,
        content: <Content />,
        visible: true,
        action2: {
          callback: goToHelp,
          label: i18n('help'),
          icon: 'info',
        },
        level: 'INFO',
      })
    },
    [goToHelp, id, setPopup],
  )

  return showHelp
}
