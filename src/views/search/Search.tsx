import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext from '../../components/bitcoin'
import i18n from '../../utils/i18n'

import { RouteProp } from '@react-navigation/native'
import { MessageContext } from '../../utils/messageUtils'
import { BigTitle, Button, Matches, Text } from '../../components'
import searchForPeersEffect from '../../effects/searchForPeersEffect'
import { thousands } from '../../utils/stringUtils'
import { saveOffer } from '../../utils/accountUtils'
import { matchOffer, unmatchOffer } from '../../utils/peachAPI/private/offer'
import { error } from '../../utils/logUtils'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'search'>

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer,
  } }>,
  navigation: ProfileScreenNavigationProp,
}
// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const [, updateMessage] = useContext(MessageContext)
  const [currentMatch, setCurrentMatch] = useState(0)
  const [offer, setOffer] = useState<BuyOffer|SellOffer>(route.params?.offer)

  const [matches, setMatches] = useState<Match[]>([])

  const toggleMatch = async (match: Match) => {
    let result
    let err

    if (!offer.id) return

    if (!match.matched) {
      [result, err] = await matchOffer({ offerId: offer.id, matchingOfferId: match.offerId })
    } else {
      [result, err] = await unmatchOffer({ offerId: offer.id, matchingOfferId: match.offerId })
    }

    if (result) {
      setMatches(() => matches.map(m => ({
        ...m,
        matched: m.offerId === match.offerId ? !m.matched : m.matched
      })))
    } else {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }

  useEffect(() => {
    const matchedOffers = matches.filter(m => m.matched).map(m => m.offerId)
    saveOffer({ ...offer, matches: matchedOffers })
    setOffer(() => ({ ...offer, matches: matchedOffers }))
  }, [matches])

  useEffect(searchForPeersEffect({
    offer,
    onSuccess: result => {
      setMatches(() => result.map(m => ({
        ...m,
        matched: offer.matches && offer.matches.indexOf(m.offerId) !== -1
      })))
    },
    onError: result => updateMessage({ msg: i18n(result.error), level: 'ERROR' }),
  }), [offer.id])

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <ScrollView style={tw`pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
          <View style={tw`h-full flex justify-center`}>
            <BigTitle title={i18n(matches.length ? 'search.youGotAMatch' : 'search.searchingForAPeer')} />
            {offer.type === 'bid' && matches.length
              ? <Text style={tw`text-grey-3 text-center -mt-2`}>
                {i18n('search.forBuying', thousands(offer.amount))}
              </Text>
              : null
            }
            <Matches style={tw`mt-9`} matches={matches} onChange={setCurrentMatch}/>
            <View style={tw`flex items-center mt-6`}>
              <Button
                title={i18n('search.matchOffer')}
                wide={false}
                onPress={() => toggleMatch(matches[currentMatch])}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  </View>
}
