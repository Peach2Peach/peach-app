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
    backButton: tw`text-primary-mild-1`,
    bg: tw`bg-transparent`,
  },
}

export const Header = () => {
  const { title, icons, titleComponent, hideGoBackButton, theme } = useHeaderState()
  const colors = themes[theme || 'default']
  const { goBack, canGoBack } = useNavigation()

  return (
    <View style={[tw` flex-row justify-between px-5 py-2 w-full`, colors.bg]}>
      <View style={tw`items-center flex-row justify-start flex-shrink`}>
        {!hideGoBackButton && canGoBack() && (
          <TouchableOpacity style={tw`w-6 h-6 mr-1 -ml-1`} onPress={goBack}>
            <Icon id="chevronLeft" color={colors.backButton.color} />
          </TouchableOpacity>
        )}
        {title ? (
          <Text style={[tw`h6 lowercase`, colors.text]} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          titleComponent
        )}
      </View>

      <View style={tw`items-center flex-row justify-end`}>
        {icons?.map(({ iconComponent, onPress }, i) => (
          <TouchableOpacity key={i} style={tw`w-6 h-6 ml-2`} onPress={onPress}>
            {iconComponent}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
