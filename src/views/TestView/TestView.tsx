import React, { useMemo } from 'react'
import { GoBackButton, OptionButton, PeachScrollView } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view' }), []))
  const navigation = useNavigation()
  const goToButtons = () => navigation.navigate('testViewButtons')
  const goToPopups = () => navigation.navigate('testViewPopups')
  return (
    <PeachScrollView
      style={tw`h-full bg-primary-mild-1`}
      contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}
    >
      <OptionButton onPress={goToButtons}>Buttons</OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToPopups}>
        Popups
      </OptionButton>
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
