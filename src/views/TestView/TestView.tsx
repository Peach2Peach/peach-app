import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { GoBackButton, OptionButton, PeachScrollView } from '../../components'
import { useHeaderState } from '../../components/header/store'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'

const useHeaderSetup = () => {
  const setHeaderState = useHeaderState((state) => state.setHeaderState)

  useFocusEffect(
    useCallback(() => {
      setHeaderState({ title: 'test view' })
    }, [setHeaderState]),
  )
}

export default () => {
  useHeaderSetup()
  const navigation = useNavigation()
  const goToButtons = () => navigation.navigate('testViewButtons')
  const goToPopups = () => navigation.navigate('testViewPopups')
  return (
    <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}>
      <OptionButton onPress={goToButtons}>Buttons</OptionButton>
      <OptionButton style={tw`mt-4`} onPress={goToPopups}>
        Popups
      </OptionButton>
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
