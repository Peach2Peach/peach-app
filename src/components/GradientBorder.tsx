import React from 'react'
import { ImageStyle, TextStyle, View, ViewStyle } from 'react-native'
import { RadialGradient } from './RadialGradient'

export const GradientBorder = ({
  children,
  gradientBorderWidths,
  defaultBorderWidths,
  gradient,
  containerStyle,
  style,
  borderStyle,
  showBorder = true,
}: {
  children: any
  gradientBorderWidths: [number, number, number, number]
  defaultBorderWidths: [number, number, number, number]
  gradient: any
  containerStyle?: any
  style?: any
  borderStyle?: any
  showBorder?: boolean
  backgroundColor?: ViewStyle & TextStyle & ImageStyle
}) => (
  <View style={containerStyle}>
    {showBorder ? (
      <View>
        <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={gradient} style={borderStyle} />
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
