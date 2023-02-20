import React, { useEffect } from 'react'
import { View, StatusBar, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { primaryGradient } from '../../utils/layout'
import { RadialGradient } from '../RadialGradient'

export type BackgroundConfig = {
  color?: 'primaryGradient' | ViewStyle
}

const defaultConfig: BackgroundConfig = {
  color: undefined,
}
type BackgroundProps = ComponentProps & {
  config?: BackgroundConfig
}

export const Background = ({ config = defaultConfig, children }: BackgroundProps) => {
  const coverStyle = tw`absolute top-0 left-0 w-full h-full`

  useEffect(() => {
    StatusBar.setBarStyle(config.color === 'primaryGradient' ? 'light-content' : 'dark-content', true)
  }, [config.color])

  return (
    <View style={tw`w-full h-full`}>
      {config.color === 'primaryGradient' ? (
        <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={primaryGradient} />
      ) : (
        <View style={[tw`w-full h-full`, config.color || tw`bg-primary-background`]} />
      )}
      <View style={coverStyle}>{children}</View>
    </View>
  )
}
