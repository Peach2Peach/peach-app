import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useMarketPrices, useTradingLimits } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { getOfferPrice } from '../../../utils/offer'
import { validatePremiumStep } from '../helpers/validatePremiumStep'
import { enforcePremiumFormat } from '../helpers/enforcePremiumFormat'
import { useSellSetup } from './useSellSetup'

export const usePremiumSetup = (offerDraft: SellOfferDraft, setOfferDraft: Dispatch<SetStateAction<SellOfferDraft>>) => {
  useSellSetup({ help: 'premium' })
  const [premiumStore, setPremiumStore, displayCurrency] = useSettingsStore(
    (state) => [state.premium, state.setPremium, state.displayCurrency],
    shallow,
  )
  const [premium, setPremium] = useState(!isNaN(premiumStore) ? premiumStore.toString() : '0')
  const [stepValid, setStepValid] = useState(false)

  const { data: priceBook } = useMarketPrices()
  const { limits } = useTradingLimits()
  const currentPrice = priceBook ? getOfferPrice(offerDraft.amount, offerDraft.premium, priceBook, displayCurrency) : 0

  const updatePremium = (value: string | number) => {
    const newPremium = enforcePremiumFormat(value)
    setPremium(newPremium)
    setPremiumStore(Number(newPremium))
  }

  useEffect(() => {
    setOfferDraft((prev) => ({
      ...prev,
      premium: Number(premium),
    }))
  }, [premium, setOfferDraft])

  useEffect(() => setStepValid(validatePremiumStep(offerDraft, priceBook, limits)), [priceBook, offerDraft, limits])

  return { premium, updatePremium, currentPrice, displayCurrency, stepValid }
}
