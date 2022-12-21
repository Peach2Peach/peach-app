import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { useSearchSetup } from './hooks/useSearchSetup'
import { CancelOfferButton, GoHomeButton, MatchInformation, NoMatchesYet } from './components'

export default (): ReactElement => {
  const hasMatches = useSearchSetup()

  return (
    <PeachScrollView>
      <View style={tw`h-full flex-col pb-6 pt-5`}>
        <View style={tw`px-6`}>{hasMatches ? <MatchInformation /> : <NoMatchesYet />}</View>
        <View style={tw`h-full flex-shrink flex-col justify-end`}>
          {hasMatches ? <Matches /> : <GoHomeButton />}
          <CancelOfferButton />
        </View>
      </View>
    </PeachScrollView>
  )
}
