import { useNavigationState } from '@react-navigation/native'
import { useEffect } from 'react'
import { StatusBar, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { primaryGradient } from '../../utils/layout'
import { isAndroid } from '../../utils/system'
import { views } from '../../views/views'
import { RadialGradient } from '../RadialGradient'

export type BackgroundConfig = {
  color?: 'primaryGradient' | ViewStyle
}
const defaultConfig: BackgroundConfig = {
  color: undefined,
}

export const Background = ({ children }: ComponentProps) => {
  const currentPage = useNavigationState((state) => state?.routes[state.index].name)
  const config = views.find((v) => v.name === currentPage)?.background || defaultConfig
  const coverStyle = tw`absolute top-0 left-0 w-full h-full`

  useEffect(() => {
    StatusBar.setBarStyle(config.color === 'primaryGradient' ? 'light-content' : 'dark-content', true)
    if (isAndroid()) StatusBar.setBackgroundColor(
      config.color === 'primaryGradient' ? primaryGradient[2].color : String(tw`text-primary-background`.color),
      true,
    )
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
