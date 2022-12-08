import React from 'react'
import { View } from 'react-native'
import { Button } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const GoHomeButton = () => {
  const navigation = useNavigation()
  const goHome = () => navigation.navigate('home', {})
  return (
    <View style={tw`flex items-center mt-6`}>
      <Button title={i18n('goBackHome')} wide={false} onPress={goHome} />
    </View>
  )
}
