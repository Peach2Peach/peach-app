import { View } from 'react-native'
import tw from '../../../styles/tailwind'

export const SliderTrack = ({ children, onLayout }: ComponentProps) => (
  <View style={[tw`rounded-full w-8 bg-primary-background-dark `, tw`border border-primary-mild-1`]}>
    <View style={tw`h-full m-[5px]`} {...{ onLayout }}>
      {children}
    </View>
  </View>
)
