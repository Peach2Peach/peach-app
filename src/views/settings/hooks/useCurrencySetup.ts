import { shallow } from 'zustand/shallow'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

export const useCurrencySetup = () => {
  const navigation = useNavigation()
  const setBitcoinCurrency = useBitcoinStore((state) => state.setCurrency)
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  )

  useHeaderSetup(i18n('currency'))

  const updateCurrency = (c: Currency) => {
    setBitcoinCurrency(c)
    setDisplayCurrency(c)
  }

  const goBack = () => {
    navigation.goBack()
  }

  return { currency: displayCurrency, updateCurrency, goBack }
}
