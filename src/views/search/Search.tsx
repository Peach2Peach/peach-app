import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView } from '../../components'
import { isSellOffer } from '../../utils/offer'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks'

export const Search = () => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <>
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-sm`, tw.md`py-md`]} bounces={false}>
        <View style={tw`flex-grow px-6`}>
          {hasMatches && isSellOffer(offer) && <MatchInformation offer={offer} />}
          {!hasMatches && <NoMatchesYet offer={offer} />}
        </View>
        {hasMatches && <Matches />}
      </PeachScrollView>
      <DailyTradingLimit />
    </>
  )
}
