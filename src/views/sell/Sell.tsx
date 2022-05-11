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

import LanguageContext from '../../contexts/language'
import BitcoinContext from '../../contexts/bitcoin'
import i18n from '../../utils/i18n'
import Main from './Main'
import OfferDetails from './OfferDetails'
import Summary from './Summary'
import Escrow from './Escrow'

import { BUCKETS } from '../../constants'
import { saveOffer } from '../../utils/offer'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { error } from '../../utils/log'
import { Loading, Navigation, PeachScrollView, Text } from '../../components'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { account } from '../../utils/account'
import { MessageContext } from '../../contexts/message'

const { LinearGradient } = require('react-native-gradients')
import { whiteGradient } from '../../utils/layout'

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
  updateOffer: React.Dispatch<React.SetStateAction<SellOffer>>,
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
  currencies: account.settings.currencies || [],
  paymentData: account.paymentData || [],
  paymentMethods: [],
  amount: account.settings.amount || BUCKETS[0],
  kyc: account.settings.kyc || false,
  kycType: account.settings.kycType || 'iban',
  funding: {
    status: 'NULL',
    amount: 0,
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
  useContext(LanguageContext)
  useContext(BitcoinContext)
  const [, updateMessage] = useContext(MessageContext)

  const [offer, setOffer] = useState<SellOffer>(getDefaultSellOffer())
  const [offerId, setOfferId] = useState<string|undefined>()
  const [stepValid, setStepValid] = useState(false)
  const [updatePending, setUpdatePending] = useState(true)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const saveAndUpdate = (offerData: SellOffer) => {
    setOffer(() => offerData)
    setOfferId(() => offerData.id)
    saveOffer(offerData)
  }

  useFocusEffect(useCallback(() => {
    const offr = route.params?.offer || getDefaultSellOffer()
    if (offr.funding.status === 'FUNDED') {
      navigation.navigate('search', { offer: offr })
      return
    }

    if (!route.params?.offer) {
      setOffer(getDefaultSellOffer())
      setOfferId(undefined)
      setUpdatePending(false)
      setPage(0)
    } else {
      setOffer(offr)
      setOfferId(offr.id)
      setUpdatePending(true)
    }
  }, [route]))

  useEffect(getOfferDetailsEffect({
    offerId,
    onSuccess: result => {
      saveAndUpdate({
        ...offer,
        ...result,
      } as SellOffer)

      if (offer.funding.status === 'FUNDED') {
        navigation.navigate('search', { offer: {
          ...offer,
          ...result,
        } })
        return
      }

      setPage(() => getInitialPageForOffer(offer))
      setUpdatePending(false)
    },
    onError: err => {
      setPage(() => getInitialPageForOffer(offer))
      setUpdatePending(false)
      error('Could not fetch offer information for offer', offer.id)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [offerId])

  useEffect(() => {
    if (screens[page].id === 'search') {
      saveAndUpdate({ ...offer })
      navigation.navigate('search', { offer })
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
      <PeachScrollView scrollRef={scroll}
        contentContainerStyle={!scrollable ? tw`h-full` : tw`pb-10`}
        style={tw`pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
          {updatePending
            ? <Loading />
            : null
          }
          {!updatePending && CurrentView
            ? <CurrentView
              offer={offer}
              updateOffer={setOffer}
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
