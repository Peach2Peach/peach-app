import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

export const ToolTip = ({ children, style }: ComponentProps): ReactElement => (
  <View style={[tw`px-3 py-2 rounded-lg bg-primary-background-light border border-black-5`, style]}>{children}</View>
)
