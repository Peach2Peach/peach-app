import React, { ReactElement } from 'react'
import MatchCarousel from './MatchCarousel'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { useMatchesSetup } from './hooks'

export const Matches = (): ReactElement => {
  useMatchesSetup()

  return (
    <View style={tw`flex-col justify-end flex-shrink h-full`}>
      <MatchCarousel />
    </View>
  )
}

export default Matches
