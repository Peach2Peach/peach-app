import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { CancelOfferButton, GoHomeButton, MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks/useSearchSetup'
import { useMatchStore } from '../../components/matches/store'

export default (): ReactElement => {
  const hasMatches = useSearchSetup()
  const { type } = useMatchStore((state) => state.offer)

  return (
    <PeachScrollView>
      <View style={tw`flex-col h-full pt-5 pb-6`}>
        <View style={tw`px-6`}>
          {hasMatches && type === 'ask' && <MatchInformation />}
          {!hasMatches && <NoMatchesYet />}
        </View>
        <View style={tw`flex-col justify-end flex-shrink h-full`}>
          {hasMatches ? <Matches /> : <GoHomeButton />}
          <CancelOfferButton />
        </View>
      </View>
    </PeachScrollView>
  )
}
