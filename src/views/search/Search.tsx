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

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'search'>

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer,
  } }>,
  navigation: ProfileScreenNavigationProp,
}
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [currentMatch, setCurrentMatch] = useState(0)
  const [offer] = useState(route.params?.offer)

  const [matches, setMatches] = useState<Match[]>([])

  const matchOffer = (match: Match) => {
    console.log(match)
  }

  useEffect(searchForPeersEffect({
    offer,
    onSuccess: result => {
      setMatches(() => result)
    },
    onError: result => updateMessage({ msg: i18n(result.error), level: 'ERROR' }),
  }), [offer.id])

  useEffect(() => {
    console.log('currentMatch', currentMatch)
  }, [currentMatch])

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
                onPress={() => matchOffer(matches[currentMatch])}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  </View>
}
