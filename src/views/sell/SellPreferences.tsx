import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { BackHandler, ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'

import OfferDetails from './OfferDetails'
import Summary from './Summary'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Loading, Navigation, PeachScrollView } from '../../components'
import { BUCKETS } from '../../constants'
import { MessageContext } from '../../contexts/message'
import pgp from '../../init/pgp'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { error, info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { saveOffer } from '../../utils/offer'
import { getTradingLimit, postOffer } from '../../utils/peachAPI'
import { useUserDataStore } from '../../store'
import shallow from 'zustand/shallow'

const { LinearGradient } = require('react-native-gradients')

type Props = {
  route: RouteProp<{ params: RootStackParamList['sell'] }>
  navigation: StackNavigation
}

export type SellViewProps = {
  offer: SellOffer
  updateOffer: (offer: SellOffer, shield?: boolean) => void
  setStepValid: Dispatch<SetStateAction<boolean>>
  back: () => void
  next: () => void
  navigation: StackNavigation
}

const getDefaultSellOffer = (account: Account, amount?: number): SellOffer => ({
  online: false,
  type: 'ask',
  creationDate: new Date(),
  premium: account.settings.premium || 1.5,
  meansOfPayment: account.settings.meansOfPayment || {},
  paymentData: {},
  originalPaymentData: [],
  amount: amount || account.settings.amount || BUCKETS[0],
  returnAddress: account.settings.returnAddress,
  kyc: account.settings.kyc || false,
  kycType: account.settings.kycType || 'iban',
  funding: {
    status: 'NULL',
    txIds: [],
    amounts: [],
    vouts: [],
    expiry: 4320,
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
    id: 'offerDetails',
    view: OfferDetails,
    scrollable: true,
  },
  {
    id: 'summary',
    view: Summary,
    scrollable: false,
  },
]

export default ({ route, navigation }: Props): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const account = useUserDataStore(
    (state) => ({
      publicKey: state.publicKey,
      settings: state.settings,
      tradingLimit: state.tradingLimit,
      pgp: state.pgp,
    }),
    shallow,
  )
  const setTradingLimit = useUserDataStore((state) => state.setTradingLimit)

  const [offer, setOffer] = useState<SellOffer>(getDefaultSellOffer(account, route.params.amount))
  const [stepValid, setStepValid] = useState(false)
  const [updatePending, setUpdatePending] = useState(false)
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { scrollable } = screens[page]
  let scroll = useRef<ScrollView>(null).current

  const saveAndUpdate = (offerData: SellOffer, shield = true) => {
    setOffer(offerData)
    if (offerData.id) saveOffer(offerData, undefined, shield)
  }

  useFocusEffect(
    useCallback(
      () => () => {
        setOffer(getDefaultSellOffer(account, route.params.amount))
        setUpdatePending(false)
        setPage(0)
      },
      [route],
    ),
  )

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

  useEffect(() => {
    if (screens[page].id === 'search') {
      saveAndUpdate({ ...offer })
      navigation.replace('search', { offer })
    }
  }, [page])

  const back = () => {
    if (page === 0) {
      navigation.goBack()
      return
    }
    setPage(page - 1)
    info('page -> ' + page)
    scroll?.scrollTo({ x: 0 })
  }

  const next = async () => {
    if (page >= screens.length - 1) {
      setUpdatePending(true)
      info('Posting offer ', JSON.stringify(offer))

      await pgp(account) // make sure pgp has been sent

      const [result, err] = await postOffer(offer)
      if (result) {
        info('Posted offer', result)

        getTradingLimit({}).then(([tradingLimit]) => {
          if (tradingLimit) {
            setTradingLimit(tradingLimit)
          }
        })

        saveAndUpdate({ ...offer, id: result.offerId })
        navigation.replace('fundEscrow', { offer: { ...offer, id: result.offerId } })
      } else if (err) {
        error('Error', err)
        updateMessage({
          msg: i18n(err.error || 'error.postOffer', ((err?.details as string[]) || []).join(', ')),
          level: 'ERROR',
        })
        back()
      }
      setUpdatePending(false)
      return
    }
    setPage(page + 1)

    scroll?.scrollTo({ x: 0 })
  }

  return (
    <View style={tw`h-full flex`}>
      <View style={tw`h-full flex-shrink`}>
        <PeachScrollView
          scrollRef={(ref) => (scroll = ref)}
          disable={!scrollable}
          contentContainerStyle={[tw`pt-7 flex flex-col`, !scrollable ? tw`h-full` : tw`min-h-full pb-10`]}
          style={tw`h-full`}
        >
          <View style={tw`h-full flex`}>
            <View style={tw`h-full flex-shrink`}>
              {updatePending ? <Loading /> : null}
              {!updatePending && CurrentView ? (
                <CurrentView
                  offer={offer}
                  updateOffer={setOffer}
                  setStepValid={setStepValid}
                  back={back}
                  next={next}
                  navigation={navigation}
                />
              ) : null}
            </View>
            {scrollable && !updatePending ? (
              <View style={tw`pt-8 px-6`}>
                <Navigation screen={currentScreen.id} back={back} next={next} stepValid={stepValid} />
              </View>
            ) : null}
          </View>
        </PeachScrollView>
      </View>
      {!scrollable && !updatePending ? (
        <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
          <View style={tw`w-full h-8 -mt-8`}>
            <LinearGradient colorList={whiteGradient} angle={90} />
          </View>
          <Navigation screen={currentScreen.id} back={back} next={next} stepValid={stepValid} />
        </View>
      ) : null}
    </View>
  )
}
