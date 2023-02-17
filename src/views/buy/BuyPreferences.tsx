import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { BackHandler, ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'

import i18n from '../../utils/i18n'
import OfferDetails from './OfferDetails'

import shallow from 'zustand/shallow'
import { Loading, Navigation, PeachScrollView } from '../../components'
import { MessageContext } from '../../contexts/message'
import { useNavigation } from '../../hooks'
import pgp from '../../init/pgp'
import { useSettingsStore } from '../../store/settingsStore'
import { updateTradingLimit } from '../../utils/account'
import { error } from '../../utils/log'
import { saveOffer } from '../../utils/offer'
import { getTradingLimit, postBuyOffer } from '../../utils/peachAPI'
import { getDefaultBuyOffer } from './helpers/getDefaultBuyOffer'
import Summary from './Summary'

export type BuyViewProps = {
  offer: BuyOfferDraft
  updateOffer: (data: BuyOfferDraft, shield?: boolean) => void
  setStepValid: (isValid: boolean) => void
}

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
    scrollable: true,
    showPrice: false,
  },
  {
    id: 'search',
    view: null,
  },
]

export default (): ReactElement => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)

  const partialSettings = useSettingsStore(
    (state) => ({
      minBuyAmount: state.minBuyAmount,
      maxBuyAmount: state.maxBuyAmount,
      meansOfPayment: state.meansOfPayment,
      kyc: state.kyc,
    }),
    shallow,
  )
  const [offer, setOffer] = useState<BuyOfferDraft>(getDefaultBuyOffer(partialSettings))
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
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
            contentContainerStyle={[tw`items-center justify-center flex-grow p-5 pb-30`]}
          >
            {CurrentView && <CurrentView updateOffer={setOffer} {...{ offer, setStepValid }} />}
          </PeachScrollView>

          <Navigation screen={currentScreen.id} {...{ next, stepValid }} />
        </>
      )}
    </View>
  )
}
