import React, { useContext } from 'react'
import { View } from 'react-native'
import { PeachScrollView, PrimaryButton, Text } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import tw from '../../../styles/tailwind'

export default () => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () =>
    updateOverlay({
      visible: false,
    })
  const openOverlay = (level: OverlayLevel) =>
    updateOverlay({
      title: 'A Bitcoin trader named Pete',
      content: (
        <View>
          <Text>
            Was quite good at P2P, you'd think{'\n'}
            He'd trade with a stranger{'\n'}
            But now he's in danger{'\n'}
            His wealth has made him quite chinky!
          </Text>
        </View>
      ),
      visible: true,
      level,
      action1: closeOverlay,
      action1Label: 'close',
      action1Icon: 'checkSquare',
      action2: closeOverlay,
      action2Label: 'also close',
      action2Icon: 'xSquare',
    })
  return (
    <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`py-10 px-6`}>
      <PrimaryButton onPress={() => openOverlay('APP')}>APP Overlay</PrimaryButton>
      <PrimaryButton style={tw`mt-4`} onPress={() => openOverlay('DEFAULT')}>
        Default Overlay
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
    </PeachScrollView>
  )
}
