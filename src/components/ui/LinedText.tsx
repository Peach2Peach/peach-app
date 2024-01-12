import { View } from 'react-native'
import tw from '../../styles/tailwind'

export const LinedText = ({ style, children }: ComponentProps) => (
  <View style={[tw`flex-row items-center justify-center `, style]}>
    <View style={tw`flex-1 h-px mr-2 bg-black-10`} />
    {children}
    <View style={tw`flex-1 h-px ml-2 bg-black-10`} />
  </View>
)
