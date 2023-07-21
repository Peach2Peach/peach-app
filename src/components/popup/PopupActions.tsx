import { View } from 'react-native'
import tw from '../../styles/tailwind'

export const PopupActions = ({ children }: ComponentProps) => (
  <View style={[tw`flex-row items-center self-stretch justify-between`, tw`bg-primary-main`]}>{children}</View>
)
