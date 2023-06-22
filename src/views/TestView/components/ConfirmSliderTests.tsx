import { Alert, View } from 'react-native'
import { Text } from '../../../components'
import { ConfirmSlider } from '../../../components/inputs'
import tw from '../../../styles/tailwind'

export const ConfirmSliderTests = () => {
  const onConfirm = () => Alert.alert('unlocked')
  return (
    <View style={tw`flex flex-col items-center`}>
      <Text style={tw`mt-4 h3`}>Slide to unlock</Text>
      <ConfirmSlider {...{ label1: 'label1', label2: 'label2', onConfirm }} />
      <ConfirmSlider style={tw`mt-4`} {...{ label1: 'only 1 label', onConfirm }} />
      <ConfirmSlider style={tw`w-[280px] mt-4`} {...{ label1: 'smaller width', onConfirm }} />
      <ConfirmSlider style={tw`w-[200px] mt-4`} {...{ label1: 'smol', onConfirm }} />
    </View>
  )
}
