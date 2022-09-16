import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'

import i18n from '../../utils/i18n'
import OfferDetails from './OfferDetails'
import ReleaseAddress from './ReleaseAddress'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Loading, Navigation, PeachScrollView } from '../../components'
import { BUCKETS } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import { MessageContext } from '../../contexts/message'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import pgp from '../../init/pgp'
import { account, updateTradingLimit } from '../../utils/account'
import { whiteGradient } from '../../utils/layout'
import { error } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { saveOffer } from '../../utils/offer'
import { getTradingLimit as getTradingLimitAPI, postOffer } from '../../utils/peachAPI'

const { LinearGradient } = require('react-native-gradients')

type Props = {
  route: RouteProp<{ params: RootStackParamList['buyPreferences'] }>,
  navigation: StackNavigation,
}

export type BuyViewProps = {
  offer: BuyOffer,
  updateOffer: (data: BuyOffer, shield?: boolean) => void,
  setStepValid: (isValid: boolean) => void,
  back: () => void,
  next: () => void,
  navigation: StackNavigation,
}

const getDefaultBuyOffer = (amount?: number): BuyOffer => ({
  online: false,
  type: 'bid',
  creationDate: new Date(),
  meansOfPayment: account.settings.meansOfPayment || {},
  paymentData: {},
  kyc: account.settings.kyc || false,
  amount: amount || account.settings.amount || BUCKETS[0],
  matches: [],
  seenMatches: [],
  matched: [],
  doubleMatched: false,
})

type Screen = null | (({ offer, updateOffer }: BuyViewProps) => ReactElement)

const screens = [
  {
    id: 'offerDetails',
    view: OfferDetails,
    scrollable: true
  },
  {
    id: 'releaseAddress',
    view: ReleaseAddress,
    scrollable: false
  },
  {
    id: 'search',
    view: null
  }
]

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)

  const [offer, setOffer] = useState<BuyOffer>(getDefaultBuyOffer(route.params.amount))
  const [stepValid, setStepValid] = useState(false)
  const [updatePending, setUpdatePending] = useState(false)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const saveAndUpdate = (offerData: BuyOffer, shield = true) => {
    setOffer(() => offerData)
    if (offerData.id) saveOffer(offerData, undefined, shield)
  }

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)

    scroll.current?.scrollTo({ x: 0 })
  }
  const back = () => {
    if (page === 0) {
      navigation.goBack()
      return
    }
    setPage(page - 1)
    scroll.current?.scrollTo({ x: 0 })
  }

  useFocusEffect(useCallback(() => {
    setOffer(getDefaultBuyOffer(route.params.amount))
    setUpdatePending(false)
    setPage(() => 0)
  }, [route]))

  useEffect(() => {
    (async () => {
      if (screens[page].id === 'search' && !offer.id) {
        setUpdatePending(true)

        await pgp() // make sure pgp has been sent
        const [result, err] = await postOffer(offer)

        if (result) {
          const [tradingLimit] = await getTradingLimitAPI()

          if (tradingLimit) {
            updateTradingLimit(tradingLimit)
          }
          saveAndUpdate({ ...offer, id: result.offerId })
          navigation.replace('search', { offer: { ...offer, id: result.offerId } })
          return
        }

        setUpdatePending(false)

        error('Error', err)
        updateMessage({
          msg: i18n(err?.error || 'error.postOffer', (err?.details as string[] || []).join(', ')),
          level: 'ERROR',
        })

        if (err?.error === 'TRADING_LIMIT_REACHED') back()
      }
    })()
  }, [page])

  return <View testID="view-buy" style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <PeachScrollView scrollRef={scroll}
        disable={!scrollable}
        contentContainerStyle={[tw`pt-7 flex flex-col`, !scrollable ? tw`h-full` : tw`min-h-full pb-10`]}
        style={tw`h-full`}>
        <View style={tw`h-full flex`}>
          <View style={tw`h-full flex-shrink`}>
            {updatePending
              ? <Loading />
              : null
            }
            {!updatePending && CurrentView
              ? <CurrentView offer={offer}
                updateOffer={setOffer}
                setStepValid={setStepValid}
                back={back} next={next}
                navigation={navigation}/>
              : null
            }
          </View>
          {scrollable && !updatePending
            ? <View style={tw`pt-8 px-6`}>
              <Navigation screen={currentScreen.id} back={back} next={next} stepValid={stepValid} />
            </View>
            : null
          }
        </View>
      </PeachScrollView>
    </View>
    {!scrollable && !updatePending
      ? <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <Navigation screen={currentScreen.id} back={back} next={next} stepValid={stepValid} />
      </View>
      : null
    }
  </View>
}
