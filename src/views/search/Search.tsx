import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Matches, PeachScrollView, Screen } from '../../components'
import { isSellOffer } from '../../utils/offer'
import { MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks'

export const Search = () => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <Screen showTradingLimit>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`} bounces={false}>
        <View style={tw`grow`}>
          {hasMatches && isSellOffer(offer) && <MatchInformation offer={offer} />}
          {!hasMatches && <NoMatchesYet offer={offer} />}
        </View>
        {hasMatches && <Matches />}
      </PeachScrollView>
    </Screen>
  )
}
