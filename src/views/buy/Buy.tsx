import { useCallback } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, PrimaryButton } from '../../components'
import { RangeAmount } from '../../components/inputs/verticalAmountSelector/RangeAmount'
import { ProgressDonut } from '../../components/ui'
import { useNavigation } from '../../hooks'
import { useConfigStore } from '../../store/configStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import LoadingScreen from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { BackupReminderIcon } from './BackupReminderIcon'
import { useBuySetup } from './hooks/useBuySetup'

export default () => {
  const navigation = useNavigation()

  const { freeTrades, maxFreeTrades } = useBuySetup()

  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)
  const [amountRange, setBuyAmountRange, rangeIsValid] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange, state.canContinue.buyAmountRange],
    shallow,
  )
  const [minTradingAmount, maxTradingAmount] = useConfigStore(
    (state) => [state.minTradingAmount, state.maxTradingAmount],
    shallow,
  )

  const setSelectedRange = useCallback(
    (newRange: [number, number]) => {
      setBuyAmountRange(newRange, { min: minTradingAmount, max: maxTradingAmount })
    },
    [maxTradingAmount, minTradingAmount, setBuyAmountRange],
  )

  const next = () => navigation.navigate('buyPreferences')

  if (amountRange[1] === Infinity) {
    return <LoadingScreen />
  }

  return (
    <View style={tw`flex h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`px-8 mt-2`}>
        <BitcoinPriceStats />
      </View>
      <RangeAmount
        style={tw`flex-shrink h-full mt-4 mb-2`}
        min={minTradingAmount}
        max={maxTradingAmount}
        value={amountRange}
        onChange={setSelectedRange}
      />
      <View style={[tw`flex-row items-center justify-center mt-4 mb-1`, tw.md`mb-4`]}>
        {freeTrades > 0 && (
          <ProgressDonut
            style={tw`absolute bottom-0 left-5`}
            title={i18n('settings.referrals.noPeachFees.freeTrades')}
            value={freeTrades}
            max={maxFreeTrades}
          />
        )}
        <PrimaryButton disabled={!rangeIsValid} onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
