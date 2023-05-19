import { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { isSellOffer } from '../../utils/offer'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks/useSearchSetup'

export default (): ReactElement => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <>
      <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`justify-center flex-grow pt-5 pb-6`} bounces={false}>
        {!hasMatches && <NoMatchesYet offer={offer} style={tw`h-full px-6`} />}
        {hasMatches && (
          <>
            <View style={tw`flex-grow px-6`}>{isSellOffer(offer) && <MatchInformation offer={offer} />}</View>
            <Matches />
          </>
        )}
      </PeachScrollView>
      {hasMatches && <DailyTradingLimit />}
    </>
  )
}
