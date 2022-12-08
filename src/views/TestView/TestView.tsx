import React from 'react'
import { OptionButton, PeachScrollView } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'

export default () => {
  const navigation = useNavigation()
  const goToButtons = () => navigation.navigate('testViewButtons')
  const goToPopups = () => navigation.navigate('testViewPopups')
  return (
    <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`py-10 px-6`}>
      <OptionButton onPress={goToButtons}>Buttons</OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToPopups}>
        Popups
      </OptionButton>
    </PeachScrollView>
  )
}
