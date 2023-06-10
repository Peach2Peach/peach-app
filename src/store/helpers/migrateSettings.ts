import { getSelectedPaymentDataIds } from '../../utils/account'
import { info } from '../../utils/log'
import { useOfferPreferences } from '../offerPreferenes'
import { SettingsStore } from '../settingsStore'

export const migrateSettings = (persistedState: unknown, version: number): SettingsStore | Promise<SettingsStore> => {
  const migratedState = persistedState as SettingsStore
  if (version === 0) {
    info('settingsStore - migrating from version 0')
    // if the stored value is in version 0, we rename the field to the new name
    migratedState.lastFileBackupDate = migratedState.lastBackupDate
    delete migratedState.lastBackupDate
  }
  if (version === 1) {
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
  }

  return migratedState
}
