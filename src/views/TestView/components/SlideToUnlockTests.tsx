import React from 'react'
import { Alert, View } from 'react-native'
import { Text } from '../../../components'
import { SlideToUnlock } from '../../../components/inputs'
import tw from '../../../styles/tailwind'

export const SlideToUnlockTests = () => {
  const onUnlock = () => Alert.alert('unlocked')
  return (
    <View style={tw`flex flex-col items-center`}>
      <Text style={tw`mt-4 h3`}>Slide to unlock</Text>
      <SlideToUnlock {...{ label1: 'label1', label2: 'label2', onUnlock }} />
      <SlideToUnlock style={tw`mt-4`} {...{ label1: 'only 1 label', onUnlock }} />
      <SlideToUnlock style={tw`w-[280px] mt-4`} {...{ label1: 'smaller width', onUnlock }} />
      <SlideToUnlock style={tw`w-[200px] mt-4`} {...{ label1: 'smol', onUnlock }} />
    </View>
  )
}
