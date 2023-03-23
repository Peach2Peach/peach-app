import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import shallow from 'zustand/shallow'
import { useMarketPrices, useTradingLimits } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { account } from '../../../utils/account'
import { getOfferPrice } from '../../../utils/offer'
import { parsePremiumToString } from '../helpers/parsePremiumToString'
import { validatePremiumStep } from '../helpers/validatePremiumStep'
import { useSellSetup } from '../hooks/useSellSetup'

export const usePremiumSetup = (offerDraft: SellOfferDraft, setOfferDraft: Dispatch<SetStateAction<SellOfferDraft>>) => {
  useSellSetup({ help: 'premium' })
  const [premiumStore, setPremiumStore] = useSettingsStore((state) => [state.premium, state.setPremium], shallow)
  const [premium, setPremium] = useState(premiumStore.toString())
  const [stepValid, setStepValid] = useState(false)

  const { data: priceBook } = useMarketPrices()
  const { limits } = useTradingLimits()
  const { displayCurrency } = account.settings
  const currentPrice = priceBook ? getOfferPrice(offerDraft.amount, offerDraft.premium, priceBook, displayCurrency) : 0

  const updatePremium = (value: string | number) => {
    setPremium(parsePremiumToString(value))
    setPremiumStore(Number(premium))
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
