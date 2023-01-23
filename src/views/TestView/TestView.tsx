import React from 'react'
import { GoBackButton, OptionButton, PeachScrollView } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
const headerConfig = { title: 'test view' }
export default () => {
  useHeaderSetup(headerConfig)
  const navigation = useNavigation()
  const goToButtons = () => navigation.navigate('testViewButtons')
  const goToPopups = () => navigation.navigate('testViewPopups')
  const goToMessages = () => navigation.navigate('testViewMessages')
  const goToComponents = () => navigation.navigate('testViewComponents')

  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`flex items-center w-full px-6 py-10`}
    >
      <OptionButton onPress={goToButtons}>Buttons</OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToPopups}>
        Popups
      </OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToMessages}>
        Messages
      </OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToComponents}>
        Components
      </OptionButton>
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
