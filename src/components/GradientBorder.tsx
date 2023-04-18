import { ReactNode } from 'react'
import { ImageStyle, StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import tw from '../styles/tailwind'
import { ColorStop, RadialGradient } from './RadialGradient'

type Props = {
  children: ReactNode
  gradientBorderWidths: [number, number, number, number]
  defaultBorderWidths: [number, number, number, number]
  gradient: ColorStop[]
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  showBorder?: boolean
  backgroundColor?: ViewStyle & TextStyle & ImageStyle
}

export const GradientBorder = ({
  children,
  gradientBorderWidths,
  defaultBorderWidths,
  gradient,
  containerStyle,
  style,
  showBorder = true,
}: Props) => (
  <View style={containerStyle}>
    {showBorder ? (
      <View>
        <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={gradient} style={tw`absolute`} />
        <View
          style={[
            {
              marginTop: gradientBorderWidths[0] + defaultBorderWidths[0],
              marginLeft: gradientBorderWidths[3] + defaultBorderWidths[3],
              marginRight: gradientBorderWidths[1] + defaultBorderWidths[1],
              marginBottom: gradientBorderWidths[2] + defaultBorderWidths[2],
            },
            style,
          ]}
        >
          {children}
        </View>
      </View>
    ) : (
      <View
        style={[
          {
            marginTop: gradientBorderWidths[0],
            marginLeft: gradientBorderWidths[3],
            marginRight: gradientBorderWidths[1],
            marginBottom: gradientBorderWidths[2],
          },
          style,
        ]}
      >
        {children}
      </View>
    )}
  </View>
)
