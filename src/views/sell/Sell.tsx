import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import i18n from '../../utils/i18n'
import Main from './Main'
import OfferDetails from './OfferDetails'
import Summary from './Summary'
import Escrow from './Escrow'

import { BUCKETS } from '../../constants'
import { saveOffer } from '../../utils/offer'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { error } from '../../utils/log'
import { Loading, Navigation, PeachScrollView, Progress } from '../../components'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { account, getTradingLimit } from '../../utils/account'
import { MessageContext } from '../../contexts/message'

const { LinearGradient } = require('react-native-gradients')
import { whiteGradient } from '../../utils/layout'
import BitcoinContext from '../../contexts/bitcoin'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'>

type Props = {
  route: RouteProp<{ params: {
    offer?: SellOffer,
    page?: number,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

export type SellViewProps = {
  offer: SellOffer,
  updateOffer: (offer: SellOffer, shield?: boolean) => void,
  setStepValid: Dispatch<SetStateAction<boolean>>,
  back: () => void,
  next: () => void,
  navigation: ProfileScreenNavigationProp,
}

const getDefaultSellOffer = (): SellOffer => ({
  online: false,
  type: 'ask',
  creationDate: new Date(),
  premium: account.settings.premium || 1.5,
  meansOfPayment: account.settings.meansOfPayment || {},
  paymentData: {},
  amount: account.settings.amount || BUCKETS[0],
  returnAddress: account.settings.returnAddress,
  // TODO integrate support for xpubs
  // returnAddress: account.settings.returnAddress && isxpub(account.settings.returnAddress)
  //   ? deriveAddress(account.settings.returnAddress, account.settings.hdStartIndex || 0)
  //   : account.settings.returnAddress,
  kyc: account.settings.kyc || false,
  kycType: account.settings.kycType || 'iban',
  funding: {
    status: 'NULL',
    txIds: [],
    amounts: [],
    vouts: [],
  },
  matches: [],
  seenMatches: [],
  matched: [],
  doubleMatched: false,
  refunded: false,
  released: false,
})

type Screen = null | (({ offer, updateOffer }: SellViewProps) => ReactElement)

const screens = [
  {
    id: 'main',
    view: Main,
    scrollable: false
  },
  {
    id: 'offerDetails',
    view: OfferDetails,
    scrollable: true
  },
  {
    id: 'summary',
    view: Summary,
    scrollable: false
  },
  {
    id: 'escrow',
    view: Escrow,
    scrollable: true
  },
  {
    id: 'search',
    view: null
  }
]


const getInitialPageForOffer = (offer: SellOffer) =>
  offer.id
    ? screens.findIndex(s => s.id === 'escrow')
    : 0

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const [bitcoinContext] = useContext(BitcoinContext)
  const [, updateMessage] = useContext(MessageContext)

  const [offer, setOffer] = useState<SellOffer>(getDefaultSellOffer())
  const [stepValid, setStepValid] = useState(false)
  const [updatePending, setUpdatePending] = useState(true)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const { daily, dailyAmount } = getTradingLimit(bitcoinContext.currency)

  const saveAndUpdate = (offerData: SellOffer, shield = true) => {
    setOffer(offerData)
    if (offerData.id) saveOffer(offerData, undefined, shield)
  }

  useFocusEffect(useCallback(() => () => {
    // restore default state when leaving flow
    setOffer(getDefaultSellOffer())
    setUpdatePending(false)
    setPage(0)
  }, []))

  useFocusEffect(useCallback(() => {
    const offr = route.params?.offer || getDefaultSellOffer()
    if (offr.funding.status === 'FUNDED') {
      navigation.replace('search', { offer: offr })
      return
    }

    if (!route.params?.offer) {
      setOffer(getDefaultSellOffer())
      setUpdatePending(false)
      setPage(0)
    } else {
      setOffer(offr)
      setUpdatePending(true)
      getOfferDetailsEffect({
        offerId: offr.id,
        onSuccess: result => {
          const sellOffer = {
            ...offr,
            ...result,
          } as SellOffer
          saveAndUpdate(sellOffer)

          if (sellOffer.funding.status === 'FUNDED') {
            navigation.replace('search', { offer: sellOffer })
            return
          }

          setPage(() => getInitialPageForOffer(sellOffer))
          setUpdatePending(false)
        },
        onError: err => {
          setPage(() => getInitialPageForOffer(offr))
          setUpdatePending(false)
          error('Could not fetch offer information for offer', offr.id)
          updateMessage({
            msg: i18n(err.error || 'error.general'),
            level: 'ERROR',
          })
        }
      })()
    }
  }, [route]))

  useEffect(() => {
    if (screens[page].id === 'search') {
      saveAndUpdate({ ...offer })
      navigation.replace('search', { offer })
    }
  }, [page])

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)

    scroll.current?.scrollTo({ x: 0 })
  }

  const back = () => {
    if (page === 0) return
    setPage(page - 1)
    scroll.current?.scrollTo({ x: 0 })
  }

  return <View style={tw`h-full flex`}>
    <View style={[
      tw`h-full flex-shrink`,
      currentScreen.id === 'main' ? tw`z-20` : {},
    ]}>
      {currentScreen.id === 'main' && !isNaN(dailyAmount)
        ? <View style={tw`h-0`}><Progress
          percent={dailyAmount / daily}
          text={i18n(
            'profile.tradingLimits.daily',
            bitcoinContext.currency, String(dailyAmount), String(daily === Infinity ? '∞' : daily)
          )}
        /></View>
        : null
      }
      <PeachScrollView scrollRef={scroll}
        disable={!scrollable}
        contentContainerStyle={!scrollable ? tw`h-full` : tw`pb-10`}
        style={tw`pt-7 overflow-visible`}>
        <View style={tw`pb-8`}>
          {updatePending
            ? <Loading />
            : null
          }
          {!updatePending && CurrentView
            ? <CurrentView
              offer={offer}
              updateOffer={saveAndUpdate}
              setStepValid={setStepValid}
              back={back} next={next}
              navigation={navigation} />
            : null
          }
        </View>
        {scrollable && !updatePending
          ? <View style={tw`mb-8 px-6`}>
            <Navigation
              screen={currentScreen.id}
              back={back} next={next}
              navigation={navigation}
              stepValid={stepValid}
              offer={offer} />
          </View>
          : null
        }
      </PeachScrollView>
    </View>
    {!scrollable && !updatePending
      ? <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <Navigation
          screen={currentScreen.id}
          back={back} next={next}
          navigation={navigation}
          stepValid={stepValid}
          offer={offer}
        />
      </View>
      : null
    }
  </View>
}
