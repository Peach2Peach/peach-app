import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Icon, Text } from '..'
import tw from '../../styles/tailwind'
import { useNavigation } from '@react-navigation/native'
import { useHeaderState } from './store'

const themes = {
  default: {
    text: tw`text-black-1`,
    backButton: tw`text-black-2`,
    bg: tw`bg-primary-background-light`,
  },
  inverted: {
    text: tw`text-primary-background-light`,
    backButton: tw`text-primary-mild`,
    bg: tw`bg-transparent`,
  },
}

export const Header = () => {
  const { title, icons, titleComponent, hideGoBackButton, theme } = useHeaderState()
  const colors = themes[theme || 'default']
  const { goBack, canGoBack } = useNavigation()

  return (
    <View style={[tw`h-9 flex-row justify-between px-8`, colors.bg]}>
      <View style={tw`items-center flex-row`}>
        {!hideGoBackButton && canGoBack() && (
          <TouchableOpacity style={tw`w-6 h-6 -ml-[10px] mr-1 -mt-0.5`} onPress={goBack}>
            <Icon id="chevronLeft" color={colors.backButton.color} />
          </TouchableOpacity>
        )}
        {title ? <Text style={[tw`h6 lowercase`, colors.text]}>{title}</Text> : titleComponent}
      </View>

      <View style={tw`items-center flex-row`}>
        {icons?.map(({ iconComponent, onPress }, i) => (
          <TouchableOpacity key={i} style={tw`w-6 h-6 mx-2`} onPress={onPress}>
            {iconComponent}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
