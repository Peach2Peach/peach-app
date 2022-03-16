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
import { saveOffer } from '../../utils/offer'
import { RouteProp } from '@react-navigation/native'
import { error } from '../../utils/log'
import { Loading, Navigation, Text } from '../../components'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { account } from '../../utils/account'
import { MessageContext } from '../../utils/message'

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

const getDefaultSellOffer = (): SellOffer => ({
  type: 'ask',
  creationDate: new Date(),
  published: false,
  premium: account.settings.premium || 1.5,
  currencies: account.settings.currencies || [],
  paymentData: account.paymentData || [],
  paymentMethods: [],
  amount: account.settings.amount || BUCKETS[0],
  kyc: account.settings.kyc || false,
  kycType: account.settings.kycType || 'iban',
  matches: [],
  doubleMatched: false,
  refunded: false,
  released: false,
})

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
    view: Loading
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

  useEffect(() => {
    const offr = route.params?.offer || getDefaultSellOffer()

    setOfferId(undefined)
    if (offr.confirmedReturnAddress) {
      navigation.navigate('search', { offer })
      return
    }


    if (!route.params?.offer && account.settings.amount) {
      setOffer(getDefaultSellOffer())
      setOfferId(() => undefined)
      setUpdatePending(false)
      setPage(0)
    } else {
      setOffer(() => offr)
      setOfferId(() => offr.id)
      setUpdatePending(true)
    }
  }, [route])

  useEffect(getOfferDetailsEffect({
    offerId,
    onSuccess: result => {
      saveAndUpdate({
        ...offer,
        ...result,
      } as SellOffer)

      if (offer.confirmedReturnAddress && offer.funding?.status === 'FUNDED') {
        navigation.navigate('search', { offer })
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
      saveAndUpdate({ ...offer, confirmedReturnAddress: true })
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

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <ScrollView ref={scroll}
        contentContainerStyle={!scrollable ? tw`h-full` : {}}
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
          ? <View style={tw`mb-8`}>
            <Navigation
              screen={currentScreen.id}
              back={back} next={next}
              stepValid={stepValid} />
          </View>
          : null
        }
      </ScrollView>
    </View>
    {!scrollable && !updatePending
      ? <Navigation
        screen={currentScreen.id}
        back={back} next={next}
        stepValid={stepValid} />
      : null
    }
  </View>
}
