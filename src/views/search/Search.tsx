import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext from '../../utils/bitcoin'
import i18n from '../../utils/i18n'

import { RouteProp, useIsFocused } from '@react-navigation/native'
import { MessageContext } from '../../utils/message'
import { BigTitle, Button, Matches, Text } from '../../components'
import searchForPeersEffect from '../../effects/searchForPeersEffect'
import { thousands } from '../../utils/string'
import { saveOffer } from '../../utils/offer'
import { matchOffer, unmatchOffer } from '../../utils/peachAPI/private/offer'
import { error, info } from '../../utils/log'
import checkFundingStatusEffect from '../sell/effects/checkFundingStatusEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'

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
  const [offer, setOffer] = useState<BuyOffer|SellOffer>(route.params.offer)
  const [updatePending, setUpdatePending] = useState(true)
  const isFocused = useIsFocused()

  const [matches, setMatches] = useState<Match[]>([])

  const saveAndUpdate = (offerData: BuyOffer|SellOffer) => {
    setOffer(offerData)
    saveOffer(offerData)
  }

  const toggleMatch = async (match: Match) => {
    let result: any
    let err

    if (!offer.id) return

    if (!match.matched) {
      [result, err] = await matchOffer({
        offerId: offer.id,
        matchingOfferId: match.offerId,
        currency: Object.keys(match.prices)[0] as Currency,
        paymentMethod: match.paymentMethods[0],
      })
    } else if (offer.type === 'bid') {
      [result, err] = await unmatchOffer({ offerId: offer.id, matchingOfferId: match.offerId })
    }

    if (result) {
      setMatches(() => matches.map(m => ({
        ...m,
        matched: m.offerId === match.offerId ? !m.matched : m.matched
      })))

      if (offer.type === 'ask') {
        saveAndUpdate({ ...offer, doubleMatched: true, contractId: result.contractId })

        if (result.contractId) navigation.navigate('contract', { contractId: result.contractId })
      }
    } else {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }

  useEffect(() => {
    if (!isFocused) return

    setOffer(route.params.offer)
    setUpdatePending(() => true)
  }, [isFocused])

  useEffect(() => {
    const matchedOffers = matches.filter(m => m.matched).map(m => m.offerId)
    saveAndUpdate({ ...offer, matches: matchedOffers })
  }, [matches])

  useEffect(offer.id ? getOfferDetailsEffect({
    offerId: offer.id,
    onSuccess: result => {
      saveOffer(result)
      setOffer(() => ({
        ...offer,
        ...result,
      }))
      setUpdatePending(() => false)
    },
    onError: () => {
      error('Could not fetch offer information for offer', offer.id)
    }
  }) : () => {}, [offer.id])

  useEffect(!updatePending ? searchForPeersEffect({
    offer,
    onSuccess: result => {
      setMatches(() => result.map(m => ({
        ...m,
        matched: offer.matches && offer.matches.indexOf(m.offerId) !== -1
      })))
    },
    onError: result => updateMessage({ msg: i18n(result.error), level: 'ERROR' }),
  }) : () => {}, [offer.id, updatePending])


  useEffect(() => 'escrow' in offer && offer.funding?.status !== 'FUNDED'
    ? checkFundingStatusEffect({
      offer,
      onSuccess: result => {
        info('Checked funding status', result)

        saveAndUpdate({
          ...offer,
          funding: result.funding,
          returnAddress: result.returnAddress,
          depositAddress: offer.depositAddress || result.returnAddress,
        })
      },
      onError: (err) => {
        updateMessage({
          msg: i18n(err.error || 'error.general'),
          level: 'ERROR',
        })
      },
    })() : () => {}, [offer.id])

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`h-full flex justify-center pb-8`}>
        <BigTitle title={i18n(matches.length ? 'search.youGotAMatch' : 'search.searchingForAPeer')} />
        {offer.type === 'bid' && matches.length
          ? <Text style={tw`text-grey-3 text-center -mt-2`}>
            {i18n('search.forBuying', thousands(offer.amount))}
          </Text>
          : null
        }
        {matches.length
          ? <View>
            <Matches style={tw`mt-9`} matches={matches} onChange={setCurrentMatch}/>
            <View style={tw`flex items-center mt-6`}>
              <Button
                title={i18n('search.matchOffer')}
                wide={false}
                onPress={() => toggleMatch(matches[currentMatch])}
              />
            </View>
          </View>
          : null
        }
      </View>
    </View>
  </View>
}
