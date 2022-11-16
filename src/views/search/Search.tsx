/* eslint-disable max-lines */
import messaging from '@react-native-firebase/messaging'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'

import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { BigTitle, Button, Headline, Icon, Loading, Matches, SatsFormat, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getOfferDetailsEffect, { useOfferDetails } from '../../effects/getOfferDetailsEffect'
import useSearchForPeers from '../../hooks/useSearchForPeers'
import ConfirmCancelOffer from '../../overlays/ConfirmCancelOffer'
import DoubleMatch from '../../overlays/info/DoubleMatch'
import Match from '../../overlays/info/Match'
import MatchAccepted from '../../overlays/MatchAccepted'
import { getPaymentDataByType } from '../../utils/account'
import { unique } from '../../utils/array'
import { error, info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { saveOffer } from '../../utils/offer'
import { unmatchOffer } from '../../utils/peachAPI'
import { matchFn } from './match'

const PAGESIZE = 10

const updaterPNs = ['offer.matchSeller', 'contract.contractCreated']

// eslint-disable-next-line max-lines-per-function, max-statements
export default (): ReactElement => {
  const route = useRoute<RouteProp<{ params: RootStackParamList['search'] }>>()
  const navigation = useNavigation<StackNavigation>()
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>()
  const [offer, setOffer] = useState<BuyOffer | SellOffer>(route.params.offer)
  const [offerId, setOfferId] = useState<string | undefined>(route.params.offer.id)
  const [page, setPage] = useState(0)
  const [matchLoading, setMatchLoading] = useState(false)
  const [pnReceived, setPNReceived] = useState(0)

  const [matches, setMatches] = useState<Match[]>([])
  const [searchingMatches, setSearchingMatches] = useState(true)

  const [seenMatches, setSeenMatches] = useState<Offer['id'][]>(route.params.offer.seenMatches)
  const currentMatch = matches[currentMatchIndex]

  const saveAndUpdate = (offerData: BuyOffer | SellOffer) => {
    setOffer(offerData)
    setOfferId(offerData.id)
    saveOffer(offerData)
  }

  const onEndReached = () => {
    if (matches.length >= PAGESIZE * page) setPage((p) => p + 1)
  }

  const setMatchingOptions = (
    match?: number | null,
    currency?: Currency | null,
    paymentMethod?: PaymentMethod | null,
  ) => {
    if (typeof match === 'number') {
      setCurrentMatchIndex(match)
      setSeenMatches((seen) => {
        seen = (offer.seenMatches || []).concat([matches[match].offerId]).filter(unique())
        saveAndUpdate({
          ...offer,
          seenMatches: seen,
        })
        return seen
      })
    }

    if (currency) setSelectedCurrency(currency)
    if (paymentMethod) setSelectedPaymentMethod(paymentMethod)
  }

  const openAddPaymentMethodDialog = () => {
    if (!selectedPaymentMethod || !selectedCurrency) return
    updateMessage({ template: null, level: 'ERROR' })
    const existingPaymentMethodsOfType = getPaymentDataByType(selectedPaymentMethod).length + 1
    const label = i18n(`paymentMethod.${selectedPaymentMethod}`) + ' #' + existingPaymentMethodsOfType

    navigation.push('paymentDetails', {
      paymentData: {
        type: selectedPaymentMethod,
        label,
        currencies: [selectedCurrency],
        country: /giftCard/u.test(selectedPaymentMethod)
          ? (selectedPaymentMethod.split('.').pop() as Country)
          : undefined,
      },
      origin: ['search', route.params],
    })
  }

  const _match = async (input: Match) =>
    matchFn(
      input,
      offer,
      selectedCurrency,
      selectedPaymentMethod,
      updateOverlay,
      setMatchLoading,
      setMatches,
      updateMessage,
      saveAndUpdate,
      navigation,
      openAddPaymentMethodDialog,
    )

  const _unmatch = async (match: Match) => {
    if (!offer || !offer.id) return

    const [result, err] = await unmatchOffer({ offerId: offer.id, matchingOfferId: match.offerId })

    if (result) {
      setMatches((prev) =>
        prev.map((m) => ({
          ...m,
          matched: m.offerId === match.offerId ? false : m.matched,
        })),
      )
    } else {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'error.general',
        level: 'ERROR',
      })
    }
  }

  const _toggleMatch = () => (currentMatch.matched ? _unmatch(currentMatch) : _match(currentMatch))

  const goHome = () => navigation.navigate('home', {})
  const goToYourTrades = () => navigation.replace('yourTrades', {})

  const cancelOffer = () =>
    updateOverlay({
      content: <ConfirmCancelOffer offer={offer} navigate={goToYourTrades} />,
      showCloseButton: false,
    })

  const openMatchHelp = () =>
    updateOverlay({
      content: offer.type === 'bid' ? <Match /> : <DoubleMatch />,
      showCloseButton: true,
      help: true,
    })

  useFocusEffect(
    useCallback(() => {
      setOffer(route.params.offer)
      setOfferId(route.params.offer.id)
      setPage(0)
      setSearchingMatches(true)
    }, [route]),
  )

  useSearchForPeers(offer, page, setSearchingMatches, offerId, route, setMatches, updateMessage, pnReceived)

  useFocusEffect(
    useCallback(
      getOfferDetailsEffect({
        offerId,
        interval: offer.type === 'bid' ? 30 * 1000 : 0,
        onSuccess: (result) => {
          saveAndUpdate({
            ...offer,
            ...result,
          })

          if (result.contractId) {
            info('Search.tsx - getOfferDetailsEffect', `navigate to contract ${result.contractId}`)
            navigation.replace('contract', { contractId: result.contractId })
          }
        },
        onError: (err) => {
          error('Could not fetch offer information for offer', offer.id)
          updateMessage({
            msgKey: err.error || 'error.general',
            level: 'ERROR',
          })
        },
      }),
      [offerId, pnReceived],
    ),
  )

  useEffect(() => {
    if (!offer.id || !matches.length) return

    const matchedOffers = matches.filter((m) => m.matched).map((m) => m.offerId)

    saveAndUpdate({
      ...offer,
      seenMatches,
      matched: matchedOffers,
    })
  }, [matches])

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null | void> => {
        if (!remoteMessage.data) return

        if (updaterPNs.includes(remoteMessage.data.type)) {
          setPNReceived(Math.random())
        }

        if (remoteMessage.data.type === 'contract.contractCreated' && remoteMessage.data.offerId !== offerId) {
          updateOverlay({
            content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigation} />,
          })
        }
      })

      return unsubscribe
    }, []),
  )

  return (
    <View style={tw`h-full flex-col justify-between pb-6 pt-5`}>
      <View style={tw`px-6`}>
        {!matches.length ? (
          <BigTitle title={i18n(route.params.hasMatches ? 'search.matchesAreWaiting' : 'search.searchingForAPeer')} />
        ) : (
          <Headline style={[tw`text-center text-2xl leading-2xl uppercase text-peach-1`, tw.md`text-3xl leading-3xl`]}>
            {i18n(matches.length === 1 ? 'search.youGotAMatch' : 'search.youGotAMatches')}
          </Headline>
        )}
        {!matches.length ? (
          searchingMatches ? (
            <View style={tw`h-12`}>
              <Loading />
              <Text style={tw`text-center`}>{i18n('loading')}</Text>
            </View>
          ) : (
            <Text style={tw`text-center mt-3`}>{i18n('search.weWillNotifyYou')}</Text>
          )
        ) : (
          <View>
            <Text style={tw`text-grey-2 text-center -mt-1`}>
              {i18n(`search.${offer.type === 'bid' ? 'buyOffer' : 'sellOffer'}`)}{' '}
              <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
            </Text>
            {offer.type !== 'bid' && (
              <Text style={tw`text-grey-2 text-center`}>
                {i18n(offer.premium > 0 ? 'search.atPremium' : 'search.atDiscount', String(Math.abs(offer.premium)))}
              </Text>
            )}
          </View>
        )}
      </View>
      <View style={tw`h-full flex-shrink flex-col justify-end`}>
        {matches.length ? (
          <View style={tw`h-full flex-shrink flex-col justify-end`}>
            <Matches
              {...{ offer, matches, navigation }}
              onChange={setMatchingOptions}
              onEndReached={onEndReached}
              toggleMatch={_toggleMatch}
              loadingMore={searchingMatches}
            />
            <View style={tw`flex-row items-center justify-center pl-11`}>
              {offer.type === 'bid' ? (
                <Button
                  title={i18n(currentMatch?.matched ? 'search.waitingForSeller' : 'search.matchOffer')}
                  wide={false}
                  disabled={currentMatch?.matched || matchLoading}
                  loading={matchLoading}
                  onPress={_toggleMatch}
                />
              ) : (
                <Button
                  title={i18n('search.acceptMatch')}
                  wide={false}
                  disabled={currentMatch?.matched}
                  onPress={() => _match(currentMatch)}
                />
              )}
              <Pressable onPress={openMatchHelp} style={tw`p-3`}>
                <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={tw`flex items-center mt-6`}>
            <Button title={i18n('goBackHome')} wide={false} onPress={goHome} />
          </View>
        )}
        <Pressable style={tw`mt-3`} onPress={cancelOffer}>
          <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>{i18n('cancelOffer')}</Text>
        </Pressable>
      </View>
    </View>
  )
}
