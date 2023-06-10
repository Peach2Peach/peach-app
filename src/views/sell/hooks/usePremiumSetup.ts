import { useMarketPrices, useTradingLimits } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { getOfferPrice } from '../../../utils/offer'
import { useSellSetup } from './useSellSetup'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import { validatePremiumStep } from '../helpers/validatePremiumStep'
import { shallow } from 'zustand/shallow'

const usePremiumStepValidation = () => {
  const { amount, premium, isStepValid, setPremium } = useOfferPreferences(
    (state) => ({
      amount: state.sellAmount,
      premium: state.premium,
      isStepValid: state.canContinue.premium,
      setPremium: state.setPremium,
    }),
    shallow,
  )
  const { data: priceBook } = useMarketPrices()
  const { limits } = useTradingLimits()

  if (isStepValid !== validatePremiumStep({ amount, premium }, priceBook, limits)) {
    setPremium(premium, validatePremiumStep({ amount, premium }, priceBook, limits))
  }
}

export const usePremiumSetup = () => {
  const { amount, premium, isStepValid } = useOfferPreferences(
    (state) => ({
      amount: state.sellAmount,
      premium: state.premium,
      isStepValid: state.canContinue.premium,
    }),
    shallow,
  )
  useSellSetup({ help: 'premium' })
  usePremiumStepValidation()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  const { data: priceBook } = useMarketPrices()
  const currentPrice = priceBook ? getOfferPrice(amount, premium, priceBook, displayCurrency) : 0

  return { currentPrice, displayCurrency, isStepValid }
}
