import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import BitcoinContext from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import Main from './Main'
import OfferDetails from './OfferDetails'
import Summary from './Summary'
import Escrow from './Escrow'
import ReturnAddress from './ReturnAddress'

import { BUCKETS } from '../../constants'
import { postOffer } from '../../utils/peachAPI'
import { saveOffer } from '../../utils/offer'
import { RouteProp, useIsFocused } from '@react-navigation/native'
import { MessageContext } from '../../utils/message'
import { error } from '../../utils/log'
import { Navigation } from '../../components'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'

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
  setStepValid: (isValid: boolean) => void,
  back: () => void,
  next: () => void,
  navigation: ProfileScreenNavigationProp,
}

export const defaultSellOffer: SellOffer = {
  type: 'ask',
  creationDate: new Date(),
  published: false,
  premium: 1.5,
  currencies: [],
  paymentData: [],
  paymentMethods: [],
  hashedPaymentData: '',
  amount: BUCKETS[0],
  kyc: false,
  matches: [],
  doubleMatched: false,
  refunded: false,
  released: false,
}
type Screen = ({ offer, updateOffer }: SellViewProps) => ReactElement

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
    scrollable: false
  },
  {
    id: 'returnAddress',
    view: ReturnAddress,
    scrollable: false
  },
  {
    id: 'search',
    view: Main
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
  const isFocused = useIsFocused()

  const [offer, setOffer] = useState<SellOffer>(defaultSellOffer)
  const [stepValid, setStepValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const saveAndUpdate = (offerData: SellOffer) => {
    setOffer(() => offerData)
    saveOffer(offerData)
  }

  useEffect(offer.id ? getOfferDetailsEffect({
    offerId: offer.id,
    onSuccess: result => {
      saveAndUpdate({
        ...offer,
        ...result,
      } as SellOffer)
    },
    onError: () => {
      error('Could not fetch offer information for offer', offer.id)
    }
  }) : () => {}, [offer.id])

  useEffect(() => {
    if (!isFocused) return

    setOffer(() => route.params?.offer || defaultSellOffer)
    setPage(() => route.params?.page || getInitialPageForOffer(route.params?.offer || defaultSellOffer))
  }, [isFocused])

  useEffect(() => {
    (async () => {
      if (screens[page].id === 'escrow' && !offer.id) {
        setLoading(true)
        const [result, err] = await postOffer(offer)

        setLoading(false)

        if (result) {
          saveAndUpdate({ ...offer, id: result.offerId })
        } else {
          error('Error', err)
          updateMessage({
            msg: i18n(err?.error || 'error.postOffer'),
            level: 'ERROR',
          })
          return
        }
      }

      if (screens[page].id === 'search') {
        saveAndUpdate({ ...offer, published: true, confirmedReturnAddress: true })
        navigation.navigate('search', { offer })
      }
    })()
  }, [page])

  useEffect(() => {
    if (!offer.published) return

    navigation.navigate('search', { offer })
  }, [offer.published])

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

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <ScrollView ref={scroll}
        contentContainerStyle={!scrollable ? tw`h-full` : {}}
        style={tw`pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
          {CurrentView
            ? <CurrentView
              offer={offer}
              updateOffer={setOffer}
              setStepValid={setStepValid}
              back={back} next={next}
              navigation={navigation} />
            : null
          }
        </View>
        {scrollable
          ? <View style={tw`mb-8`}>
            <Navigation
              screen={currentScreen.id}
              back={back} next={next} navigation={navigation}
              loading={loading} stepValid={stepValid} />
          </View>
          : null
        }
      </ScrollView>
    </View>
    {!scrollable
      ? <Navigation
        screen={currentScreen.id}
        back={back} next={next} navigation={navigation}
        loading={loading} stepValid={stepValid} />
      : null
    }
  </View>
}
