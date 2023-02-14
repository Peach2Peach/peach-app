import React, { useCallback, useContext } from 'react'
import { Text } from '../../../components/text'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const useShowDisputeDisclaimer = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const showDisclaimer = useCallback(
    async (chat: Chat, setAndSaveChat: Function) => {
      const goToHelp = () => {
        updateOverlay({
          visible: false,
        })
        navigation.navigate('contact')
      }
      setAndSaveChat(chat.id, { seenDisputeDisclaimer: true })
      updateOverlay({
        title: i18n('trade.chat'),
        level: 'INFO',
        content: (
          <>
            <Text>{i18n('chat.disputeDisclaimer.1')}</Text>
            <Text style={tw`mt-3`}>
              {i18n('chat.disputeDisclaimer.2')}
              <Text style={tw`underline`}>{i18n('chat.disputeDisclaimer.3')}</Text>
              {i18n('chat.disputeDisclaimer.4')}
            </Text>
            <Text style={tw`mt-3`}>{i18n('chat.disputeDisclaimer.5')}</Text>
          </>
        ),
        visible: true,
        action1: {
          callback: () => {
            updateOverlay({ visible: false })
          },
          label: i18n('close'),
          icon: 'info',
        },
        action2: {
          callback: goToHelp,
          label: i18n('help'),
          icon: 'info',
        },
      })
    },
    [navigation, updateOverlay],
  )
  return showDisclaimer
}
