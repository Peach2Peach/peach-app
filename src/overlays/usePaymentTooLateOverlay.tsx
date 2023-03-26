import { useCallback, useContext } from 'react';
import { Text } from 'react-native'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const usePaymentTooLateOverlay = () => {
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
      title: i18n('help.tooLate.title'),
      content: (
        <>
          <Text style={tw`mb-3 body-m text-black-1`}>{i18n('help.tooLate.text.1')}</Text>
          <Text style={tw`body-m text-black-1`}>{i18n('help.tooLate.text.2')}</Text>
        </>
      ),
      visible: true,
      action2: {
        callback: goToHelp,
        label: i18n('help'),
        icon: 'info',
      },
      level: 'WARN',
    })
  }, [navigation, updateOverlay])

  return showHelp
}
