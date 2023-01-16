import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { BackHandler, ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'

import i18n from '../../utils/i18n'
import OfferDetails from './OfferDetails'
import ReleaseAddress from './ReleaseAddress'

import { useFocusEffect } from '@react-navigation/native'
import { Loading, Navigation, PeachScrollView } from '../../components'
import { MINTRADINGAMOUNT, MAXTRADINGAMOUNT } from '../../constants'
import { MessageContext } from '../../contexts/message'
import pgp from '../../init/pgp'
import { account, updateTradingLimit } from '../../utils/account'
import { error } from '../../utils/log'
import { saveOffer } from '../../utils/offer'
import { getTradingLimit, postOffer } from '../../utils/peachAPI'
import { useNavigation, useRoute } from '../../hooks'
import { useMatchStore } from '../../components/matches/store'

export type BuyViewProps = {
  offer: BuyOffer
  updateOffer: (data: BuyOffer, shield?: boolean) => void
  setStepValid: (isValid: boolean) => void
}

const getDefaultBuyOffer = (amount: [number, number]): BuyOffer => ({
  online: false,
  type: 'bid',
  creationDate: new Date(),
  lastModified: new Date(),
  meansOfPayment: account.settings.meansOfPayment || {},
  paymentData: {},
  originalPaymentData: [],
  kyc: account.settings.kyc || false,
  amount: amount || [account.settings.minAmount, account.settings.maxAmount],
  matches: [],
  seenMatches: [],
  matched: [],
  doubleMatched: false,
  tradeStatus: 'messageSigningRequired',
})

type Screen = null | (({ offer, updateOffer }: BuyViewProps) => ReactElement)

const screens = [
  {
    id: 'offerDetails',
    view: OfferDetails,
    scrollable: true,
  },
  {
    id: 'releaseAddress',
    view: ReleaseAddress,
    scrollable: false,
  },
  {
    id: 'search',
    view: null,
  },
]

export default (): ReactElement => {
  const route = useRoute<'buyPreferences'>()
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const [offer, setOffer] = useState<BuyOffer>(getDefaultBuyOffer(route.params.amount))
  const [stepValid, setStepValid] = useState(false)
  const [updatePending, setUpdatePending] = useState(false)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  let scroll = useRef<ScrollView>(null).current

  const saveAndUpdate = (offerData: BuyOffer, shield = true) => {
    setOffer(() => offerData)
    if (offerData.id) saveOffer(offerData, undefined, shield)
  }

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (page === 0) {
        return false
      }
      setPage(page - 1)
      return true
    })
    return () => {
      listener.remove()
    }
  })

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)

    scroll?.scrollTo({ x: 0 })
  }
  const back = useCallback(() => {
    if (page === 0) {
      navigation.goBack()
      return
    }
    setPage(page - 1)
    scroll?.scrollTo({ x: 0 })
  }, [navigation, page, scroll])

  useFocusEffect(
    useCallback(() => {
      setOffer(getDefaultBuyOffer(route.params.amount))
      setUpdatePending(false)
      setPage(() => 0)
    }, [route]),
  )

  useEffect(() => {
    ;(async () => {
      if (screens[page].id === 'search' && !offer.id) {
        setUpdatePending(true)

        await pgp() // make sure pgp has been sent
        const [result, err] = await postOffer(offer)

        if (result) {
          getTradingLimit({}).then(([tradingLimit]) => {
            if (tradingLimit) {
              updateTradingLimit(tradingLimit)
            }
          })
          saveAndUpdate({ ...offer, id: result.offerId })
          matchStoreSetOffer({ ...offer, id: result.offerId })
          navigation.replace('signMessage', { offerId: result.offerId })
          return
        }

        setUpdatePending(false)

        error('Error', err)
        updateMessage({
          msgKey: i18n(err?.error || 'POST_OFFER_ERROR', ((err?.details as string[]) || []).join(', ')),
          level: 'ERROR',
          action: {
            callback: () => navigation.navigate('contact'),
            label: i18n('contactUs'),
            icon: 'mail',
          },
        })

        if (err?.error === 'TRADING_LIMIT_REACHED') back()
      }
    })()
  }, [back, matchStoreSetOffer, navigation, offer, page, updateMessage])

  return (
    <View testID="view-buy" style={tw`flex-1`}>
      {updatePending ? (
        <View style={tw`absolute items-center justify-center w-full h-full`}>
          <Loading />
        </View>
      ) : (
        <>
          <PeachScrollView
            scrollRef={(ref) => (scroll = ref)}
            disable={!scrollable}
            contentContainerStyle={[tw`justify-center flex-grow p-5 pb-30`]}
          >
            {CurrentView && <CurrentView updateOffer={setOffer} {...{ offer, setStepValid }} />}
          </PeachScrollView>

          <Navigation screen={currentScreen.id} {...{ next, stepValid }} />
        </>
      )}
    </View>
  )
}
