import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { GoHomeButton, MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks/useSearchSetup'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'

export default (): ReactElement => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>

  return (
    <>
      <PeachScrollView>
        <View style={tw`flex-col h-full pt-5 pb-6`}>
          <View style={tw`px-6`}>
            {hasMatches && offer.type === 'ask' && <MatchInformation />}
            {!hasMatches && <NoMatchesYet />}
          </View>
          <View style={tw`flex-col justify-end flex-shrink h-full`}>{hasMatches ? <Matches /> : <GoHomeButton />}</View>
        </View>
      </PeachScrollView>
      <DailyTradingLimit />
    </>
  )
}
