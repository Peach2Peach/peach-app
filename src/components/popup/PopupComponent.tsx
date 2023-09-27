import { View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'
import { PopupActions } from './PopupActions'
import { PopupContent } from './PopupContent'

type Props = {
  content: React.ReactNode
  actions: React.ReactNode
  title?: string
  bgColor?: ViewStyle
  actionBgColor?: ViewStyle
}

export const PopupComponent = ({ content, actions, title, bgColor, actionBgColor }: Props) => (
  <View style={tw`mx-6 overflow-hidden rounded-2xl`}>
    <PopupContent style={[bgColor, tw`items-stretch`]}>
      {!!title && <PopupTitle text={title} />}
      {content}
    </PopupContent>
    <PopupActions style={actionBgColor}>{actions}</PopupActions>
  </View>
)

function PopupTitle ({ text }: { text: string }) {
  return <Text style={tw`w-full h5`}>{text}</Text>
}
