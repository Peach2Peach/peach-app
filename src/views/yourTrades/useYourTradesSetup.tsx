import { useCallback, useMemo, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { getContracts, getOffers } from '../../utils/peachAPI'
import { hasDoubleMatched } from './utils'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'
import shallow from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { sort } from '../../utils/array'

export const useYourTradesSetup = () => {
  const showErrorBanner = useShowErrorBanner()
  const [offers, setOffers, contracts, setContracts] = useTradeSummaryStore(
    (state) => [state.offers, state.setOffers, state.contracts, state.setContracts],
    shallow,
  )

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('yourTrades.title'),
        hideGoBackButton: true,
      }),
      [],
    ),
  )

  useFocusEffect(
    useCallback(() => {
      const checkingFunction = async () => {
        const [getOffersResult, getOffersErr] = await getOffers({})
        const [getContractsResult, getContractsErr] = await getContracts({})
        if (getOffersResult && getContractsResult) {
          setOffers(getOffersResult.filter((offer) => !hasDoubleMatched(offer.tradeStatus)))
          setContracts(getContractsResult)
        }
        if (getOffersErr || getContractsErr) {
          showErrorBanner((getOffersErr || getContractsErr)!.error)
        }
      }
      checkingFunction()
      const interval = setInterval(checkingFunction, 15 * 1000)

      return () => {
        clearInterval(interval)
      }
    }, [setContracts, setOffers, showErrorBanner]),
  )

  return {
    trades: [...offers, ...contracts].sort(sort('lastModified')).reverse(),
  }
}
