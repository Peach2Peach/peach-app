import React, { ReactElement } from 'react'
import MatchCarousel from './MatchCarousel'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { MatchOfferButton, MatchHelpButton } from './buttons'
import { useMatchesSetup } from './hooks'

export const Matches = (): ReactElement => {
  useMatchesSetup()

  return (
    <View style={tw`flex-col justify-end flex-shrink h-full`}>
      <MatchCarousel />
      <View style={tw`flex-row items-center justify-center pl-11`}>
        <MatchOfferButton />
        <MatchHelpButton />
      </View>
    </View>
  )
}

export default Matches
