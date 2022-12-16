import React, { useContext, useMemo } from 'react'
import { View } from 'react-native'
import { GoBackButton, PeachScrollView, PrimaryButton, Text } from '../../../components'
import { MessageContext } from '../../../contexts/message'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - popups' }), []))
  const [, updateMessage] = useContext(MessageContext)

  const openMessage = (level: MessageState['level'], options: Partial<MessageState> = {}) =>
    updateMessage({
      msgKey: 'GENERAL_ERROR',
      level,
      action: {
        callback: () => updateMessage({ msgKey: undefined, level: 'OK' }),
        label: 'an action',
        icon: 'mail',
      },
      ...options,
    })
  return (
    <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}>
      <PrimaryButton onPress={() => openMessage('OK')}>ok message</PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('ERROR')}>
        error message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('WARN')}>
        warn message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('INFO')}>
        info message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('DEBUG')}>
        debug message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('WARN', { action: undefined })}>
        message without action
      </PrimaryButton>
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
