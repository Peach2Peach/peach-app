import { View } from 'react-native'
import tw from '../styles/tailwind'
import { PeachyGradient } from './PeachyGradient'

type Props = {
  gradientBorderWidth: number
  showBorder?: boolean
} & View['props']

export const GradientBorder = ({ gradientBorderWidth, showBorder = true, children, ...viewProps }: Props) => (
  <View {...viewProps}>
    {showBorder && <PeachyGradient style={tw`absolute`} />}
    <View style={{ margin: gradientBorderWidth }}>{children}</View>
  </View>
)
