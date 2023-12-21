import { View } from 'react-native'
import { PeachyBackground } from './PeachyBackground'

type Props = {
  gradientBorderWidth: number
  showBorder?: boolean
} & View['props']

export const GradientBorder = ({ gradientBorderWidth, showBorder = true, children, ...viewProps }: Props) => (
  <View {...viewProps}>
    {showBorder && <PeachyBackground />}
    <View style={{ margin: gradientBorderWidth }}>{children}</View>
  </View>
)
