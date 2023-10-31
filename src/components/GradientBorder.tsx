import { View } from 'react-native'
import tw from '../styles/tailwind'
import { ColorStop, RadialGradient } from './RadialGradient'

type Props = {
  gradient: ColorStop[]
  gradientBorderWidth: number
  showBorder?: boolean
} & View['props']

export const GradientBorder = ({ gradient, gradientBorderWidth, showBorder = true, children, ...viewProps }: Props) => (
  <View {...viewProps}>
    {showBorder && (
      <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={gradient} style={tw`absolute`} />
    )}
    <View style={{ margin: gradientBorderWidth }}>{children}</View>
  </View>
)
