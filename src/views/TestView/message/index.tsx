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

  const closeOverlay = () =>
    updateOverlay({
      visible: false,
    })
  const openOverlay = (level: OverlayLevel, options: Partial<OverlayState> = {}) =>
    updateMessage({
      msgKey: (err as Error).message || 'GENERAL_ERROR',
      level: 'ERROR',
      action: {
        callback: () => navigationRef.navigate('contact'),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  return (
    <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}>
      <PrimaryButton onPress={() => openOverlay('APP')}>APP Overlay</PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openOverlay('APP', { requireUserAction: true })}>
        User action required
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openOverlay('DEFAULT')}>
        Default Overlay
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openOverlay('WARN')}>
        Warn Overlay
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openOverlay('ERROR')}>
        Error Overlay
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openOverlay('SUCCESS')}>
        Error Overlay
      </PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openOverlay('INFO')}>
        Info Overlay
      </PrimaryButton>
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
