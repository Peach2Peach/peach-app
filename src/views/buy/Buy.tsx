import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import BitcoinContext from '../../contexts/bitcoin'
import i18n from '../../utils/i18n'
import Main from './Main'
import OfferDetails from './OfferDetails'
import ReleaseAddress from './ReleaseAddress'

import { BUCKETS } from '../../constants'
import { postOffer } from '../../utils/peachAPI'
import { saveOffer } from '../../utils/offer'
import { RouteProp } from '@react-navigation/native'
import { MessageContext } from '../../contexts/message'
import { error } from '../../utils/log'
import { Loading, Navigation, PeachScrollView } from '../../components'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { account } from '../../utils/account'

const { LinearGradient } = require('react-native-gradients')
import { whiteGradient } from '../../utils/layout'

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

const getDefaultBuyOffer = (): BuyOffer => ({
  type: 'bid',
  creationDate: new Date(),
  published: false,
  currencies: account.settings.currencies || [],
  paymentMethods: account.settings.paymentMethods || [],
  kyc: account.settings.kyc || false,
  amount: account.settings.amount || BUCKETS[0],
  matches: [],
  doubleMatched: false,
})

type Screen = null | (({ offer, updateOffer }: BuyViewProps) => ReactElement)

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
  }
]

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)
  const [, updateMessage] = useContext(MessageContext)

  const [offer, setOffer] = useState<BuyOffer>(getDefaultBuyOffer())
  const [offerId, setOfferId] = useState<string|undefined>()
  const [stepValid, setStepValid] = useState(false)
  const [updatePending, setUpdatePending] = useState(true)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const saveAndUpdate = (offerData: BuyOffer) => {
    setOffer(() => offerData)
    setOfferId(() => offerData.id)
    saveOffer(offerData)
  }

  useEffect(() => {
    const offr = route.params?.offer || getDefaultBuyOffer()

    if (!route.params?.offer) {
      setOffer(getDefaultBuyOffer())
      setOfferId(() => undefined)
      setUpdatePending(false)
      setPage(() => 0)
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
      } as BuyOffer)
      setUpdatePending(false)
    },
    onError: err => {
      error('Could not fetch offer information for offer', offer.id)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [offerId])


  useEffect(() => {
    (async () => {
      if (screens[page].id === 'search' && !offer.id) {
        setUpdatePending(true)
        const [result, err] = await postOffer({
          ...offer,
        })

        if (result) {
          saveAndUpdate({ ...offer, id: result.offerId, published: true })
          navigation.navigate('search', { offer: { ...offer, id: result.offerId, published: true } })
          return
        }

        setUpdatePending(false)

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
    <View style={[
      tw`h-full flex-shrink`,
      currentScreen.id === 'main' ? tw`z-20` : {},
    ]}>
      <PeachScrollView scrollRef={scroll}
        contentContainerStyle={!scrollable ? tw`h-full` : {}}
        style={tw`pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
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
          ? <View style={tw`mb-8`}>
            <Navigation
              screen={currentScreen.id}
              back={back} next={next}
              stepValid={stepValid} />
          </View>
          : null
        }
      </PeachScrollView>
    </View>
    {!scrollable && !updatePending
      ? <View style={tw`mt-4 flex items-center w-full bg-white-1`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <Navigation
          screen={currentScreen.id}
          back={back} next={next}
          stepValid={stepValid} />
      </View>
      : null
    }
  </View>
}
