import React, { useContext } from 'react'
import { View } from 'react-native'
import { GoBackButton, PeachScrollView, PrimaryButton, Text } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'

const headerConfig = { title: 'test view - popups' }

export default () => {
  useHeaderSetup(headerConfig)
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () =>
    updateOverlay({
      visible: false,
    })
  const openOverlay = (level: OverlayLevel, options: Partial<OverlayState> = {}) =>
    updateOverlay({
      title: 'There once was a trader named Pete',
      content: (
        <View>
          <Text>
            Who traded bitcoin on peach{'\n'}
            He found it quite neat{'\n'}
            To trade on the street{'\n'}
            And never again would he lose a seat
          </Text>
        </View>
      ),
      visible: true,
      level,
      action1: {
        callback: closeOverlay,
        label: 'close',
        icon: 'checkSquare',
      },
      action2: {
        callback: closeOverlay,
        label: 'also close',
        icon: 'xSquare',
      },
      ...options,
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
