import { useCallback } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, PrimaryButton } from '../../components'
import { SelectAmount } from '../../components/inputs/verticalAmountSelector/SelectAmount'
import { useNavigation } from '../../hooks'
import { useConfigStore } from '../../store/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BackupReminderIcon } from '../buy/BackupReminderIcon'
import LoadingScreen from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useSellSetup } from './hooks/useSellSetup'

export default () => {
  const navigation = useNavigation()
  useSellSetup({ help: 'sellingBitcoin', hideGoBackButton: true })

  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)
  const [sellAmount, setSellAmount, isAmountValid] = useOfferPreferences(
    (state) => [state.sellAmount, state.setSellAmount, state.canContinue.sellAmount],
    shallow,
  )
  const [minTradingAmount, maxTradingAmount] = useConfigStore(
    (state) => [state.minTradingAmount, state.maxTradingAmount],
    shallow,
  )

  const updateSellAmount = useCallback(
    (value: number) => {
      setSellAmount(value, { min: minTradingAmount, max: maxTradingAmount })
    },
    [setSellAmount, minTradingAmount, maxTradingAmount],
  )
  const next = () => navigation.navigate('premium')

  return minTradingAmount === 0 ? (
    <LoadingScreen />
  ) : (
    <View style={tw`h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`px-8 mt-2`}>
        <BitcoinPriceStats />
      </View>
      <SelectAmount
        style={tw`flex-shrink h-full mt-4 mb-2`}
        min={minTradingAmount}
        max={maxTradingAmount}
        value={sellAmount}
        onChange={updateSellAmount}
      />
      <View style={[tw`flex-row items-center justify-center mt-4 mb-1`, tw.md`mb-4`]}>
        <PrimaryButton disabled={!isAmountValid} onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
