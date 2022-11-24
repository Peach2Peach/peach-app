import { RouteProp, useRoute } from '@react-navigation/native'
import { useEffect, useMemo } from 'react'

import { getAvailableCurrencies, getAvailableMethods, getMatchCurrency, getMatchPaymentMethod } from '../../utils/match'
import { getMoPsInCommon, hasMoPsInCommon } from '../../utils/paymentMethod'
import { useMatchStore } from './store'

export const useMatchSetup = (match: Match) => {
  const { offer } = useRoute<RouteProp<{ params: RootStackParamList['search'] }>>().params

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
  } = useMatchStore()

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
