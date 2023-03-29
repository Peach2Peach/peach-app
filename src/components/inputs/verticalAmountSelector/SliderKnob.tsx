import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'
import { useKnobHeight } from './hooks/useKnobHeight'

export const SliderKnob = ({ style }: ComponentProps) => {
  const knobHeight = useKnobHeight()
  return (
    <View style={[{ height: knobHeight }, tw`items-center justify-center w-full rounded-full bg-primary-main`, style]}>
      <Icon id="chevronsLeft" style={tw`w-4 h-4`} color={tw`text-primary-background-light`.color} />
    </View>
  )
}
