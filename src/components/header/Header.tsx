import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Icon, Text } from '..'
import tw from '../../styles/tailwind'
import { useNavigation } from '@react-navigation/native'
import { useHeaderState } from './store'

export const Header = () => {
  const { title, icons, titleComponent, hideGoBackButton } = useHeaderState()
  const { goBack, canGoBack } = useNavigation()

  return (
    <View style={tw`h-9 flex-row justify-between px-8`}>
      <View style={tw`items-center flex-row`}>
        {!hideGoBackButton && canGoBack() && (
          <TouchableOpacity style={tw`w-6 h-6 -ml-[10px] mr-1 -mt-0.5`} onPress={goBack}>
            <Icon id="chevronLeft" />
          </TouchableOpacity>
        )}
        {title ? <Text style={tw`h6`}>{title}</Text> : titleComponent}
      </View>

      <View style={tw`items-center flex-row`}>
        {icons?.map(({ iconComponent, onPress }) => (
          <TouchableOpacity style={tw`w-6 h-6 mx-2`} onPress={onPress}>
            {iconComponent}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
