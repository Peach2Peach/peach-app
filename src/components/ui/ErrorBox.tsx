import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

export const ErrorBox = ({ children, style }: ComponentProps): ReactElement => (
  <View style={[tw`flex-row items-center px-3 py-2 rounded-lg bg-error-light`, style]}>
    <Icon id="alertTriangle" style={tw`w-6 h-6`} color={tw`text-primary-background-light`.color} />
    <View style={tw`flex-shrink w-full pl-3`}>
      <Text style={tw`subtitle-2 text-primary-background-light`}>{children}</Text>
    </View>
  </View>
)
