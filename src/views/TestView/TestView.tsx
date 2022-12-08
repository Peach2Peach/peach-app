import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { OptionButton, PeachScrollView } from '../../components'
import tw from '../../styles/tailwind'

export default () => {
  const navigation = useNavigation()
  const goToButtons = () => navigation.navigate('testViewButtons', {})
  return (
    <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`py-10 px-6`}>
      <OptionButton onPress={goToButtons}>Buttons</OptionButton>
    </PeachScrollView>
  )
}
