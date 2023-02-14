import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { BackHandler, ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'

import i18n from '../../utils/i18n'
import OfferDetails from './OfferDetails'

import { Loading, Navigation, PeachScrollView } from '../../components'
import { MessageContext } from '../../contexts/message'
import { useNavigation, useRoute } from '../../hooks'
import pgp from '../../init/pgp'
import { account, updateTradingLimit } from '../../utils/account'
import { error } from '../../utils/log'
import { saveOffer } from '../../utils/offer'
import { getTradingLimit, postBuyOffer } from '../../utils/peachAPI'
import Summary from './Summary'
import { useSettingsStore } from '../../store/settingsStore'
import shallow from 'zustand/shallow'

export type BuyViewProps = {
  offer: BuyOfferDraft
  updateOffer: (data: BuyOfferDraft, shield?: boolean) => void
  setStepValid: (isValid: boolean) => void
}

const getDefaultBuyOffer = (amount: [number, number]): BuyOfferDraft => ({
  type: 'bid',
  creationDate: new Date(),
  lastModified: new Date(),
  meansOfPayment: account.settings.meansOfPayment || {},
  paymentData: {},
  releaseAddress: '',
  originalPaymentData: [],
  kyc: account.settings.kyc || false,
  amount: amount || [account.settings.minAmount, account.settings.maxAmount],
})

type Screen = null | (({ offer, updateOffer }: BuyViewProps) => ReactElement)

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
    showPrice: false,
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
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const [offer, setOffer] = useState<BuyOfferDraft>(getDefaultBuyOffer(route.params.amount))
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
  }, [page])

  const next = () => {
    if (page === 0) {
      // summary screen (pages should be refactored into single views)
      if (!peachWalletActive && !payoutAddress && !payoutAddressLabel) {
        setPeachWalletActive(true)
      }
    }
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

  useEffect(() => {
    setOffer(getDefaultBuyOffer(route.params.amount))
    setUpdatePending(false)
    setPage(() => 0)
  }, [route])

  useEffect(() => {
    ;(async () => {
      if (screens[page].id === 'search' && !('id' in offer)) {
        setUpdatePending(true)

        await pgp() // make sure pgp has been sent
        const [result, err] = await postBuyOffer(offer)

        if (result) {
          getTradingLimit({}).then(([tradingLimit]) => {
            if (tradingLimit) {
              updateTradingLimit(tradingLimit)
            }
          })
          saveAndUpdate({ ...offer, id: result.offerId } as BuyOffer)
          navigation.replace('offerPublished', { offerId: result.offerId })
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
  }, [back, navigation, offer, page, updateMessage])

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
