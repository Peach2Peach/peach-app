import React, { ReactElement } from 'react'
import MatchCarousel from './MatchCarousel'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { MatchOfferButton, MatchHelpButton } from './buttons'
import { useMatchesSetup } from './hooks'

/**
 * @description Component to display matches to the offer of the current route
 * @example
 * <Matches />
 */
export const Matches = (): ReactElement => {
  useMatchesSetup()

  return (
    <View style={tw`h-full flex-shrink flex-col justify-end`}>
      <MatchCarousel />
      <View style={tw`flex-row items-center justify-center pl-11`}>
        <MatchOfferButton />
        <MatchHelpButton />
      </View>
    </View>
  )
}

export default Matches
