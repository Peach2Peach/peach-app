import { useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import { useSettingsStore } from '../../../store/useSettingsStore'
import i18n from '../../../utils/i18n'

export const useCurrencySetup = () => {
  const navigation = useNavigation()
  const setBitcoinCurrency = useBitcoinStore((state) => state.setCurrency)
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  )
  const [currency, setCurrency] = useState(displayCurrency)

  useHeaderSetup(useMemo(() => ({ title: i18n('currency') }), []))

  const updateCurrency = (c: Currency) => {
    setBitcoinCurrency(c)
    setDisplayCurrency(c)
    navigation.goBack()
  }

  return { currency, setCurrency, updateCurrency }
}
