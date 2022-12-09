import { useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { useRoute } from '../../../hooks'

import {
  getAvailableCurrencies,
  getAvailableMethods,
  getMatchCurrency,
  getMatchPaymentMethod,
} from '../../../utils/match'
import { getMoPsInCommon, hasMoPsInCommon } from '../../../utils/paymentMethod'
import { useMatchStore } from '../store'

export const useMatchSetup = (match: Match) => {
  const { offer } = useRoute<'search'>().params

  const mopsInCommon = useMemo(
    () =>
      hasMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
        ? getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
        : match.meansOfPayment,
    [match.meansOfPayment, offer.meansOfPayment],
  )

  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setAvailableCurrencies,
    setAvailablePaymentMethods,
  } = useMatchStore(
    (state) => ({
      selectedCurrency: state.selectedCurrency,
      setSelectedCurrency: state.setSelectedCurrency,
      selectedPaymentMethod: state.selectedPaymentMethod,
      setSelectedPaymentMethod: state.setSelectedPaymentMethod,
      setAvailableCurrencies: state.setAvailableCurrencies,
      setAvailablePaymentMethods: state.setAvailablePaymentMethods,
    }),
    shallow,
  )

  const defaultCurrency = useMemo(() => getMatchCurrency(offer, match), [offer, match])
  const defaultPaymentMethod = useMemo(() => getMatchPaymentMethod(offer, match), [offer, match])

  useEffect(() => {
    setSelectedCurrency(defaultCurrency)
    setSelectedPaymentMethod(defaultPaymentMethod)
  }, [defaultCurrency, defaultPaymentMethod, setSelectedCurrency, setSelectedPaymentMethod])

  useEffect(() => {
    setAvailablePaymentMethods(getAvailableMethods(match, selectedCurrency, mopsInCommon))
  }, [match, selectedCurrency, mopsInCommon, setAvailablePaymentMethods])

  useEffect(() => {
    setAvailableCurrencies(getAvailableCurrencies(offer, match, selectedPaymentMethod))
  }, [match, offer, selectedPaymentMethod, setAvailableCurrencies])
}
