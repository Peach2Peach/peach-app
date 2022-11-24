import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import CancelOfferButton from './components/CancelOfferButton'
import GoHomeButton from './components/GoHomeButton'
import { useOfferMatches } from './hooks/useOfferMatches'
import MatchInformation from './components/MatchInformation'
import NoMatchesYet from './components/NoMatchesYet'

export default (): ReactElement => {
  const {
    data: { matches },
  } = useOfferMatches()

  return (
    <PeachScrollView>
      <View style={tw`h-full flex-col pb-6 pt-5`}>
        <View style={tw`px-6`}>{!matches.length ? <NoMatchesYet /> : <MatchInformation />}</View>
        <View style={tw`h-full flex-shrink flex-col justify-end`}>
          {!!matches.length ? <Matches /> : <GoHomeButton />}
          <CancelOfferButton />
        </View>
      </View>
    </PeachScrollView>
  )
}
