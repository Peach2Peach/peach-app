import React, { ReactElement, useCallback, useState } from 'react'
import { BackHandler, View } from 'react-native'
import tw from '../../styles/tailwind'

import OfferDetails from './OfferDetails'

import shallow from 'zustand/shallow'
import { useSettingsStore } from '../../store/settingsStore'
import { getDefaultBuyOffer } from './helpers/getDefaultBuyOffer'
import Summary from './Summary'
import { useFocusEffect } from '@react-navigation/native'

export type BuyViewProps = {
  offer: BuyOfferDraft
  updateOffer: (data: BuyOfferDraft, shield?: boolean) => void
  next: () => void
}

type Screen = null | (({ offer, updateOffer }: BuyViewProps) => ReactElement)

const screens = [
  {
    id: 'offerDetails',
    view: OfferDetails,
  },
  {
    id: 'summary',
    view: Summary,
    showPrice: false,
  },
]

export default (): ReactElement => {
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

  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view

  useFocusEffect(
    useCallback(() => {
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
    }, [page]),
  )

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)
  }

  return (
    <View testID="view-buy" style={tw`flex-1`}>
      {!!CurrentView && <CurrentView updateOffer={setOffer} {...{ offer, next }} />}
    </View>
  )
}
