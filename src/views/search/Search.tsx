import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { isSellOffer } from '../../utils/offer'

export default () => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <>
      <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`justify-center flex-grow pt-5 pb-6`} bounces={false}>
        <View style={tw`flex-grow px-6`}>
          {hasMatches && isSellOffer(offer) && <MatchInformation offer={offer} />}
          {!hasMatches && <NoMatchesYet offer={offer} style={tw`items-center mx-2`} />}
        </View>
        {hasMatches && <Matches />}
      </PeachScrollView>
      <DailyTradingLimit />
    </>
  )
}
