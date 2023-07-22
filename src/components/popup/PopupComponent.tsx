import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { PopupActions } from './PopupActions'
import { PopupContent } from './PopupContent'

type Props = {
  content: React.ReactNode
  actions: React.ReactNode
}

export const PopupComponent = ({ content, actions }: Props) => (
  <View style={tw`mx-6 overflow-hidden rounded-2xl`}>
    <PopupContent>{content}</PopupContent>
    <PopupActions>{actions}</PopupActions>
  </View>
)
