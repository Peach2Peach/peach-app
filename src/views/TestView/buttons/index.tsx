import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { GoBackButton, PeachScrollView } from '../../../components'
import { useHeaderState } from '../../../components/header/store'
import tw from '../../../styles/tailwind'
import { GoBackButtons } from './GoBackButtons'
import { InfoButtons } from './InfoButtons'
import { OptionButtons } from './OptionButtons'
import { PrimaryButtons } from './PrimaryButtons'

const useHeaderSetup = () => {
  const setHeaderState = useHeaderState((state) => state.setHeaderState)

  useFocusEffect(
    useCallback(() => {
      setHeaderState({ title: 'test view - buttons' })
    }, [setHeaderState]),
  )
}

export default () => {
  useHeaderSetup()
  return (
    <PeachScrollView style={tw`h-full bg-primary-mild`} contentContainerStyle={tw`w-full py-10 px-6 flex items-center`}>
      <PrimaryButtons />
      <InfoButtons />
      <GoBackButtons />
      <OptionButtons />
      <GoBackButton white wide style={tw`mt-8`} />
    </PeachScrollView>
  )
}
