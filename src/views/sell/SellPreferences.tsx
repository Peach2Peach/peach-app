import React, { ReactElement, useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import shallow from 'zustand/shallow'
import tw from '../../styles/tailwind'

import OfferDetails from './OfferDetails'
import Summary from './Summary'

import { BitcoinPriceStats, HorizontalLine } from '../../components'
import { useSettingsStore } from '../../store/settingsStore'
import { getDefaultSellOffer } from './helpers/getDefaultSellOffer'
import Premium from './Premium'

export type SellViewProps = {
  offer: SellOfferDraft
  updateOffer: (offer: SellOfferDraft) => void
  next: () => void
}

type Screen = null | (({ offer, updateOffer }: SellViewProps) => ReactElement)

const screens = [
  {
    id: 'premium',
    view: Premium,
    showPrice: true,
  },
  {
    id: 'offerDetails',
    view: OfferDetails,
    showPrice: false,
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
      sellAmount: state.sellAmount,
      premium: state.premium,
      meansOfPayment: state.meansOfPayment,
      payoutAddress: state.payoutAddress,
      kyc: state.kyc,
      kycType: state.kycType,
    }),
    shallow,
  )

  const [offer, setOffer] = useState(getDefaultSellOffer(partialSettings))
  const [page, setPage] = useState(0)

  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view

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

  const next = async () => {
    setPage(page + 1)
  }

  return (
    <View testID="view-sell" style={tw`flex-1`}>
      {currentScreen.showPrice && (
        <View style={tw`px-8`}>
          <HorizontalLine style={tw`mb-2`} />
          <BitcoinPriceStats />
        </View>
      )}
      {!!CurrentView && <CurrentView updateOffer={setOffer} {...{ offer, next }} />}
    </View>
  )
}
