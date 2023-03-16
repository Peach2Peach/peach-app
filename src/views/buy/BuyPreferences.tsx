import React, { ReactElement, useCallback, useState } from 'react'
import { BackHandler, View } from 'react-native'
import tw from '../../styles/tailwind'

import OfferDetails from './OfferDetails'

import shallow from 'zustand/shallow'
import { useSettingsStore } from '../../store/settingsStore'
import { getBuyOfferDraft } from './helpers/getBuyOfferDraft'
import Summary from './Summary'
import { useFocusEffect } from '@react-navigation/native'

export type BuyViewProps = {
  offerDraft: BuyOfferDraft
  setOfferDraft: React.Dispatch<React.SetStateAction<BuyOfferDraft>>
  next: () => void
}

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
    }),
    shallow,
  )
  const [offerDraft, setOfferDraft] = useState(getBuyOfferDraft(partialSettings))

  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView = currentScreen.view

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
      {!!CurrentView && <CurrentView {...{ offerDraft, setOfferDraft, next }} />}
    </View>
  )
}
