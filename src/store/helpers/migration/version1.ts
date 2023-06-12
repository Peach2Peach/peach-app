import { getSelectedPaymentDataIds } from '../../../utils/account'
import { info } from '../../../utils/log'
import { useOfferPreferences } from '../../offerPreferenes'
import { SettingsStore } from '../../settingsStore'

export const version1 = (migratedState: SettingsStore) => {
  const { setPaymentMethods, setPremium, setBuyAmountRange, setSellAmount } = useOfferPreferences.getState()
  info('settingsStore - migrating from version 1')
  // @ts-expect-error
  setPaymentMethods(getSelectedPaymentDataIds(migratedState.preferredPaymentMethods))
  // @ts-expect-error
  setPremium(migratedState.premium)
  // @ts-expect-error
  setBuyAmountRange([migratedState.minBuyAmount, migratedState.maxBuyAmount], { min: 0, max: 0 })
  // @ts-expect-error
  setSellAmount(migratedState.sellAmount, { min: 0, max: 0 })
  useOfferPreferences
    .getState()
    // @ts-expect-error
    .setPaymentMethods(getSelectedPaymentDataIds(migratedState.preferredPaymentMethods))
  // @ts-expect-error
  delete migratedState.preferredPaymentMethods
  // @ts-expect-error
  delete migratedState.premium
  // @ts-expect-error
  delete migratedState.minBuyAmount
  // @ts-expect-error
  delete migratedState.maxBuyAmount
  // @ts-expect-error
  delete migratedState.sellAmount
  return migratedState
}
