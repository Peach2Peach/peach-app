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
    bg: tw`bg-primary-background`,
  },
  inverted: {
    text: tw`text-primary-background-light`,
    backButton: tw`text-primary-mild-1`,
    bg: tw`bg-transparent`,
  },
}

export const Header = () => {
  const { title, icons, titleComponent, hideGoBackButton, theme } = useHeaderState()
  const colors = themes[theme || 'default']
  const { goBack, canGoBack } = useNavigation()

  return (
    <View style={[tw`flex-row justify-between w-full px-8 py-2`, colors.bg]}>
      <View style={tw`flex-row items-center justify-start flex-shrink`}>
        {!hideGoBackButton && canGoBack() && (
          <TouchableOpacity style={tw`w-6 h-6 mr-1 -ml-3`} onPress={goBack}>
            <Icon id="chevronLeft" color={colors.backButton.color} />
          </TouchableOpacity>
        )}
        {title ? (
          <Text style={[tw`lowercase h6`, colors.text]} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          titleComponent
        )}
      </View>

      <View style={tw`flex-row items-center justify-end`}>
        {icons?.map(({ iconComponent, onPress }, i) => (
          <TouchableOpacity key={i} style={tw`w-6 h-6 ml-4`} onPress={onPress}>
            {iconComponent}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
