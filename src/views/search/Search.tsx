import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks/useSearchSetup'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'

export default (): ReactElement => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <>
      <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`justify-center h-full pt-5 pb-6`}>
        <View style={tw`flex-grow px-6`}>
          {hasMatches && offer.type === 'ask' && <MatchInformation />}
          {!hasMatches && <NoMatchesYet offer={offer} style={tw`items-center mx-2`} />}
        </View>
        {hasMatches && <Matches />}
      </PeachScrollView>
      <DailyTradingLimit />
    </>
  )
}
