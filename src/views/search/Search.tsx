/* eslint-disable max-lines */
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  Pressable,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'

import { RouteProp } from '@react-navigation/native'
import { MessageContext } from '../../contexts/message'
import { BigTitle, Button, Headline, Matches, Text } from '../../components'
import searchForPeersEffect from '../../effects/searchForPeersEffect'
import { thousands } from '../../utils/string'
import { saveOffer } from '../../utils/offer'
import { matchOffer, unmatchOffer } from '../../utils/peachAPI/private/offer'
import { error, info } from '../../utils/log'
import checkFundingStatusEffect from '../../effects/checkFundingStatusEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { OverlayContext } from '../../contexts/overlay'
import { cancelOffer } from '../../utils/peachAPI'
import { signAndEncrypt, signAndEncryptSymmetric } from '../../utils/pgp'
import ConfirmCancelTrade from './components/ConfirmCancelTrade'
import { account } from '../../utils/account'
import { getRandom, sha256 } from '../../utils/crypto'
import { decryptSymmetricKey } from '../contract/helpers/parseContract'
import MatchDisclaimer from './components/MatchDisclaimer'
import SearchingForBuyOffers from './components/SearchingForBuyOffers'
import { unique } from '../../utils/array'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'search'>

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer,
  } }>,
  navigation: ProfileScreenNavigationProp,
}
// eslint-disable-next-line max-lines-per-function, max-statements
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>()
  const [offer, setOffer] = useState<BuyOffer|SellOffer>(route.params.offer)
  const [offerId, setOfferId] = useState<string|undefined>(route.params.offer.id)
  const [updatePending, setUpdatePending] = useState(true)

  const [matches, setMatches] = useState<Match[]>([])
  const currentMatch = matches[currentMatchIndex]

  const saveAndUpdate = (offerData: BuyOffer|SellOffer) => {
    setOffer(offerData)
    setOfferId(offerData.id)
    saveOffer(offerData)
  }

  const setMatchingOptions = (match?: number|null, currency?: Currency|null, paymentMethod?: PaymentMethod|null) => {
    if (typeof match === 'number') setCurrentMatchIndex(match)
    if (currency) setSelectedCurrency(currency)
    if (paymentMethod) setSelectedPaymentMethod(paymentMethod)
  }

  // eslint-disable-next-line max-statements, max-lines-per-function
  const _match = async (match: Match) => {
    let encryptedSymmmetricKey
    let encryptedPaymentData
    let paymentData

    if (!offer || !offer.id) return

    if (!selectedCurrency || !selectedPaymentMethod) {
      error(
        'Match data missing values.',
        `selectedCurrency: ${selectedCurrency}`,
        `selectedPaymentMethod: ${selectedPaymentMethod}`
      )
      return
    }

    if (offer.type === 'bid') {
      encryptedSymmmetricKey = await signAndEncrypt(
        (await getRandom(256)).toString('hex'),
        [account.pgp.publicKey, match.user.pgpPublicKey].join('\n')
      )
    } else if (offer.type === 'ask') {
      const [symmetricKey, decryptErr] = await decryptSymmetricKey(
        match.symmetricKeyEncrypted, match.symmetricKeySignature,
        match.user.pgpPublicKey
      )

      if (decryptErr) error(decryptErr)

      paymentData = offer.paymentData?.find(data =>
        data.type === match.paymentMethods[0]
      ) as Omit<PaymentData, 'id' | 'type'>

      if (!paymentData) { // TODO show payment Data form again
        error('Payment data could not be found for offer', offer.id)
        updateMessage({
          msg: i18n('search.error.paymentDataMissing'),
          level: 'ERROR',
        })
        return
      }

      delete paymentData.selected
      delete paymentData.id
      delete paymentData.type

      encryptedPaymentData = await signAndEncryptSymmetric(
        JSON.stringify(paymentData),
        symmetricKey
      )
    }

    // TODO handle 404 error (match already taken)
    const [result, err] = await matchOffer({
      offerId: offer.id, matchingOfferId: match.offerId,
      currency: selectedCurrency, paymentMethod: selectedPaymentMethod,
      symmetricKeyEncrypted: encryptedSymmmetricKey?.encrypted,
      symmetricKeySignature: encryptedSymmmetricKey?.signature,
      paymentDataEncrypted: encryptedPaymentData?.encrypted,
      paymentDataSignature: encryptedPaymentData?.signature,
      hashedPaymentData: paymentData ? sha256(JSON.stringify(paymentData)) : undefined,
    })

    if (result) {
      setMatches(() => matches.map(m => {
        if (m.offerId !== match.offerId) return m
        m.matched = true
        if (result.matchedPrice) m.matchedPrice = result.matchedPrice
        return m
      }))

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

  const _unmatch = async (match: Match) => {
    if (!offer || !offer.id) return

    const [result, err] = await unmatchOffer({ offerId: offer.id, matchingOfferId: match.offerId })

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

  const _toggleMatch = () => currentMatch.matched ? _unmatch(currentMatch) : _match(currentMatch)

  // const _decline = () => {
    // alert('todo')
  // }
  const confirmCancelTrade = async () => {
    if (!offer.id) return

    const [result, err] = await cancelOffer({
      offerId: offer.id,
      satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })
    if (result) {
      info('Cancel offer: ', JSON.stringify(result))
      if (offer.type === 'ask' && offer.funding) {
        saveAndUpdate({
          ...offer, online: false,
          funding: {
            ...offer.funding,
            status: 'CANCELED',
          }
        })
      } else {
        saveAndUpdate({ ...offer, online: false })
      }
    } else if (err) {
      error('Error', err)
    }
  }

  const cancelTrade = () => updateOverlay({
    content: <ConfirmCancelTrade offer={offer} confirm={confirmCancelTrade} navigation={navigation} />,
    showCloseButton: false
  })

  useEffect(() => {
    setOffer(route.params.offer)
    setOfferId(route.params.offer.id)
    setUpdatePending(() => true)
  }, [route])

  useEffect(() => {
    if (!offer.id || !matches.length) return

    const matchedOffers = matches.filter(m => m.matched).map(m => m.offerId)

    saveAndUpdate({ ...offer, matches: matchedOffers })
  }, [matches])

  useEffect(getOfferDetailsEffect({
    offerId,
    interval: offer.type === 'bid' ? 30 * 1000 : 0,
    onSuccess: result => {
      saveAndUpdate({
        ...offer,
        ...result,
      })

      if (result.contractId) navigation.navigate('contract', { contractId: result.contractId })

      setUpdatePending(() => false)
    },
    onError: err => {
      error('Could not fetch offer information for offer', offer.id)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [offerId])

  useEffect(!updatePending ? searchForPeersEffect({
    offer,
    onSuccess: result => {
      setMatches(() => matches.concat(result)
        .filter(unique('offerId'))
        .filter((match, i) => {
          // don't mess with the current slide position by removing previous slides
          if (i < currentMatchIndex + 1) return true
          // otherwise, remove later slides if they are not present in results
          return result.some(m => m.offerId === match.offerId)
        })
        .map(match => {
          const update = result.find(m => m.offerId === match.offerId)
          match.prices = (update || match).prices
          return match
        })
      )
    },
    onError: err => updateMessage({ msg: i18n(err.error), level: 'ERROR' }),
  }) : () => {}, [updatePending])

  useEffect(() => 'escrow' in offer && offer.funding?.status !== 'FUNDED'
    ? checkFundingStatusEffect({
      offer,
      onSuccess: result => {
        info('Checked funding status', result)

        saveAndUpdate({
          ...offer,
          funding: result.funding,
          // TODO this should not be necessary after updating sell offer order
          returnAddress: result.returnAddress,
          depositAddress: offer.depositAddress || result.returnAddress,
        })
      },
      onError: err => {
        updateMessage({
          msg: i18n(err.error || 'error.general'),
          level: 'ERROR',
        })
      },
    })() : () => {}, [offer.id])

  return <View style={tw`h-full flex pb-24`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`h-full flex justify-center pb-8 pt-12`}>
        <View style={tw`px-6`}>
          {!matches.length
            ? <BigTitle title={i18n('search.searchingForAPeer')} />
            : <Headline style={tw`text-center text-3xl leading-3xl uppercase text-peach-1`}>
              {i18n(matches.length === 1 ? 'search.youGotAMatch' : 'search.youGotAMatches')}
            </Headline>
          }
          {offer.type === 'ask' && !matches.length
            ? <SearchingForBuyOffers />
            : null
          }
          {matches.length
            ? <Text style={tw`text-grey-2 text-center -mt-2`}>
              {i18n(offer.type === 'bid' ? 'search.buyOffer' : 'search.sellOffer')} <Text style={tw`text-grey-1`}>{thousands(offer.amount)}</Text> {i18n('currency.SATS')} { // eslint-disable-line max-len
              }
            </Text>
            : null
          }
        </View>
        {matches.length
          ? <View>
            <Matches style={tw`mt-9`} offer={offer} matches={matches}
              onChange={setMatchingOptions} toggleMatch={_toggleMatch}/>
            {offer.type === 'bid'
              ? <View style={tw`flex items-center mt-6`}>
                <Button
                  title={i18n(currentMatch?.matched ? 'search.waitingForSeller' : 'search.matchOffer')}
                  wide={false}
                  disabled={currentMatch?.matched}
                  onPress={_toggleMatch}
                />
                <MatchDisclaimer matched={currentMatch?.matched}/>
              </View>
              : <View style={tw`flex-row justify-center mt-6`}>
                {/* <Button
                  title={i18n('search.declineMatch')}
                  wide={false}
                  secondary={true}
                  disabled={currentMatch?.matched}
                  onPress={_decline}
                /> */}
                <Button
                  // style={tw`ml-6`}
                  title={i18n('search.acceptMatch')}
                  wide={false}
                  disabled={currentMatch?.matched}
                  onPress={() => _match(currentMatch)}
                />
              </View>
            }
          </View>
          : <View style={tw`flex items-center mt-6`}>
            <Button
              title={i18n('goBackHome')}
              wide={false}
              onPress={() => navigation.navigate('home', {})}
            />
          </View>
        }
        <Pressable style={tw`mt-4`} onPress={cancelTrade}>
          <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>
            {i18n('cancelTrade')}
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
}
