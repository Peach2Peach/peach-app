import React, { useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
const { RadialGradient } = require('react-native-gradients')

export const GradientBorder = ({
  children,
  borderWidths,
  gradient,
  containerStyle,
  style,
  borderStyle,
  showBorder = true,
}: {
  children: any
  borderWidths: [number, number, number, number]
  gradient: any
  containerStyle?: any
  style?: any
  borderStyle?: any
  showBorder?: boolean
}) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 })
  const width = layout.width - (borderWidths[1] + borderWidths[3])
  const height = layout.height - (borderWidths[0] + borderWidths[2])

  return (
    <View
      style={containerStyle}
      onLayout={(e) => {
        setLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
      }}
    >
      <View style={borderStyle}>
        {showBorder ? (
          <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={gradient} />
        ) : (
          // Note: this only hides the border for elements with 'bg-primary-background-light' background
          <View style={tw`w-full h-full bg-primary-background-light`} />
        )}
      </View>
      <View
        style={[
          tw`absolute items-center justify-center`,
          {
            top: borderWidths[0],
            left: borderWidths[3],
            right: borderWidths[1],
            bottom: borderWidths[2],
            width,
            height,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  )
}
