import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'
import { useKnobHeight } from './hooks/useKnobHeight'

export const SliderKnob = ({ style }: ComponentProps) => {
  const height = useKnobHeight()
  return (
    <View style={[{ height }, tw`w-full items-center justify-center rounded-full bg-primary-main`, style]}>
      <Icon id="menu" style={tw`w-3 h-3`} color={tw`text-primary-background-light`.color} />
    </View>
  )
}
