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

import { useFocusEffect } from '@react-navigation/native'
import { Loading, Navigation, PeachScrollView } from '../../components'
import { MINTRADINGAMOUNT } from '../../constants'
import { MessageContext } from '../../contexts/message'
import pgp from '../../init/pgp'
import { account, updateTradingLimit } from '../../utils/account'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { saveOffer } from '../../utils/offer'
import { getTradingLimit, postOffer } from '../../utils/peachAPI'
import { useNavigation, useRoute } from '../../hooks'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useSettingsStore } from '../../store/settingsStore'
import shallow from 'zustand/shallow'

export type SellViewProps = {
  offer: SellOfferDraft
  updateOffer: (offer: SellOfferDraft) => void
  setStepValid: Dispatch<SetStateAction<boolean>>
}

const getDefaultSellOffer = (amount?: number): SellOfferDraft => ({
  type: 'ask',
  creationDate: new Date(),
  lastModified: new Date(),
  tradeStatus: 'fundEscrow',
  premium: account.settings.premium || 1.5,
  meansOfPayment: account.settings.meansOfPayment || {},
  paymentData: {},
  originalPaymentData: [],
  amount: amount || account.settings.minAmount || MINTRADINGAMOUNT,
  returnAddress: account.settings.returnAddress,
  kyc: account.settings.kyc || false,
  kycType: account.settings.kycType || 'iban',
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

export default (): ReactElement => {
  const route = useRoute<'sellPreferences'>()
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const [peachWalletActive] = useSettingsStore((state) => [state.peachWalletActive], shallow)

  const [offer, setOffer] = useState(getDefaultSellOffer(route.params.amount))
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
        setOffer(getDefaultSellOffer(route.params.amount))
        setUpdatePending(false)
        setPage(0)
      },
      [route],
    ),
  )

  useEffect(() => {
    ;(async () => {
      if (!peachWalletActive || offer.returnAddress) return
      setOffer({
        ...offer,
        returnAddress: (await peachWallet.getReceivingAddress()) || '',
      })
    })()
  }, [offer, peachWalletActive])

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

      await pgp() // make sure pgp has been sent

      const [result, err] = await postOffer({
        ...offer,
        amount: undefined,
      })
      if (result) {
        info('Posted offer', result)

        getTradingLimit({}).then(([tradingLimit]) => {
          if (tradingLimit) {
            updateTradingLimit(tradingLimit)
          }
        })

        saveAndUpdate({ ...offer, id: result.offerId } as SellOffer)
        navigation.replace('fundEscrow', { offer: { ...offer, id: result.offerId } as SellOffer })
      } else if (err) {
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
        back()
      }
      setUpdatePending(false)
      return
    }
    setPage(page + 1)

    scroll?.scrollTo({ x: 0 })
  }

  return (
    <View testID="view-sell" style={tw`flex-1`}>
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
