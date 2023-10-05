import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useMarketPrices, useTradingLimits } from '../../../hooks'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import { validatePremiumStep } from '../helpers/validatePremiumStep'

export const usePremiumStepValidation = () => {
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

  useEffect(() => {
    const isValid = validatePremiumStep({ amount, premium }, priceBook, limits)
    if (isValid !== isStepValid) {
      setPremium(premium, validatePremiumStep({ amount, premium }, priceBook, limits))
    }
  }, [amount, isStepValid, limits, premium, priceBook, setPremium])
}
