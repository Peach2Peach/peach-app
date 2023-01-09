import React, { useEffect } from 'react'
import { View, StatusBar } from 'react-native'
import tw from '../../styles/tailwind'
import { primaryGradient } from '../../utils/layout'
import { useBackgroundState } from './backgroundStore'
const { RadialGradient } = require('react-native-gradients')

export const Background = ({ children }: ComponentProps) => {
  const { color } = useBackgroundState()
  const coverStyle = tw`absolute top-0 left-0 w-full h-full`

  useEffect(() => {
    StatusBar.setBarStyle(color === 'primaryGradient' ? 'light-content' : 'dark-content', true)
  }, [color])

  return (
    <View style={tw`w-full h-full`}>
      {color === 'primaryGradient' ? (
        <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={primaryGradient} />
      ) : (
        <View style={[tw`w-full h-full`, color || tw`bg-primary-background`]} />
      )}
      <View style={coverStyle}>{children}</View>
    </View>
  )
}
