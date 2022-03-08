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
import ReleaseAddress from './ReleaseAddress'

import { BUCKETS } from '../../constants'
import { postOffer } from '../../utils/peachAPI'
import { saveOffer } from '../../utils/offer'
import { RouteProp, useIsFocused } from '@react-navigation/native'
import { MessageContext } from '../../utils/message'
import { error } from '../../utils/log'
import { Navigation } from '../../components'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'buy'>

type Props = {
  route: RouteProp<{ params: {
    offer?: BuyOffer,
    page?: number,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

export type BuyViewProps = {
  offer: BuyOffer,
  updateOffer: (data: BuyOffer) => void,
  setStepValid: (isValid: boolean) => void,
  back: () => void,
  next: () => void,
  navigation: ProfileScreenNavigationProp,
}

export const defaultBuyOffer: BuyOffer = {
  type: 'bid',
  creationDate: new Date(),
  published: false,
  currencies: [],
  paymentMethods: [],
  kyc: false,
  amount: BUCKETS[0],
  matches: [],
  doubleMatched: false,
}
type Screen = ({ offer, updateOffer }: BuyViewProps) => ReactElement

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
    id: 'releaseAddress',
    view: ReleaseAddress,
    scrollable: false
  },
  {
    id: 'search',
    view: Main
  }
]

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)
  const [, updateMessage] = useContext(MessageContext)
  const isFocused = useIsFocused()

  const [offer, setOffer] = useState<BuyOffer>(defaultBuyOffer)
  const [stepValid, setStepValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const saveAndUpdate = (offerData: BuyOffer) => {
    setOffer(() => offerData)
    saveOffer(offerData)
  }

  useEffect(offer.id ? getOfferDetailsEffect({
    offerId: offer.id,
    onSuccess: result => {
      saveAndUpdate({
        ...offer,
        ...result,
      } as BuyOffer)
    },
    onError: () => {
      error('Could not fetch offer information for offer', offer.id)
    }
  }) : () => {}, [offer.id])

  useEffect(() => {
    if (!isFocused) return

    setOffer(() => route.params?.offer || defaultBuyOffer)
    setPage(() => route.params?.page || 0)
  }, [isFocused])

  useEffect(() => {
    (async () => {
      if (screens[page].id === 'search' && !offer.id) {
        setLoading(true)
        const [result, err] = await postOffer({
          ...offer,
        })

        setLoading(false)

        if (result) {
          saveAndUpdate({ ...offer, id: result.offerId, published: true })
          navigation.navigate('search', { offer: { ...offer, id: result.offerId, published: true } })
          return
        }

        error('Error', err)
        updateMessage({
          msg: i18n(err?.error || 'error.postOffer'),
          level: 'ERROR',
        })
      }
    })()
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

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <ScrollView ref={scroll}
        contentContainerStyle={!scrollable ? tw`h-full` : {}}
        style={tw`pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
          {CurrentView
            ? <CurrentView offer={offer}
              updateOffer={setOffer}
              setStepValid={setStepValid}
              back={back} next={next}
              navigation={navigation}/>
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
