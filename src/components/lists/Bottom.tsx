import { View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

type Props = {
  icon?: JSX.Element
  text?: string
  messages: number
}

export const Bottom = ({ icon, text, messages }: Props) => (
  <View style={[tw`flex-row items-center justify-between gap-1 px-4 py-6px rounded-b-xl`, tw`bg-success-main`]}>
    <Icon id="messageFull" style={tw`opacity-0 w-7 h-7`} color={tw`text-primary-background-light`.color} />
    <View style={tw`flex-row items-center gap-1`}>
      {icon}
      <Text style={tw`subtitle-1 text-primary-background-light`}>{text}</Text>
    </View>
    <View style={tw`items-center justify-center w-7 h-7`}>
      <Icon id="messageFull" style={tw`w-7 h-7`} color={tw`text-primary-background-light`.color} />
      <Text style={tw`absolute text-center font-baloo-bold`}>{messages}</Text>
    </View>
  </View>
)
