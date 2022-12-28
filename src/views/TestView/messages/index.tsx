import React, { useContext, useMemo } from 'react'
import { GoBackButton, PeachScrollView, PrimaryButton } from '../../../components'
import { MessageContext } from '../../../contexts/message'
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
        callback: () => updateMessage({ msgKey: undefined, level: 'SUCCESS' }),
        label: 'an action',
        icon: 'mail',
      },
      ...options,
    })
  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}
    >
      <PrimaryButton onPress={() => openMessage('SUCCESS')}>ok message</PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('ERROR')}>
        error message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('WARN')}>
        warn message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('INFO')}>
        info message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('DEFAULT')}>
        debug message
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} onPress={() => openMessage('WARN', { action: undefined })}>
        message without action
      </PrimaryButton>
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
