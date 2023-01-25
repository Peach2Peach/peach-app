import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { CancelOfferButton, GoHomeButton, MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks/useSearchSetup'

export default (): ReactElement => {
  const { hasMatches, offerId } = useSearchSetup()

  return (
    <PeachScrollView>
      <View style={tw`flex-col h-full pt-5 pb-6`}>
        <View style={tw`px-6`}>{hasMatches ? <MatchInformation offerId={offerId} /> : <NoMatchesYet />}</View>
        <View style={tw`flex-col justify-end flex-shrink h-full`}>
          {hasMatches ? <Matches offerId={offerId} /> : <GoHomeButton />}
          <CancelOfferButton offerId={offerId} />
        </View>
      </View>
    </PeachScrollView>
  )
}
