import { useContext } from 'react'
import { PeachScrollView, PrimaryButton } from '../../../components'
import { MessageContext } from '../../../contexts/message'
import tw from '../../../styles/tailwind'

export const TestViewMessages = () => {
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
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
    >
      <PrimaryButton onPress={() => openMessage('SUCCESS')}>ok message</PrimaryButton>
      <PrimaryButton
        style={tw`mt-2`}
        onPress={() =>
          openMessage('APP', {
            msgKey: 'notification.contract.buyer.disputeRaised',
            bodyArgs: ['PC-123-456', '200000 sats'],
          })
        }
      >
        message with args
      </PrimaryButton>
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
    </PeachScrollView>
  )
}
