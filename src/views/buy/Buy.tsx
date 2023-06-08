import { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, PrimaryButton } from '../../components'
import { RangeAmount } from '../../components/inputs/verticalAmountSelector/RangeAmount'
import { ProgressDonut } from '../../components/ui'
import { useNavigation, useValidatedState } from '../../hooks'
import { useDebounce } from '../../hooks/useDebounce'
import { useConfigStore } from '../../store/configStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useOfferPreferences } from '../../store/useOfferPreferences'
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
  const [[minBuyAmount, maxBuyAmount], setMinBuyAmount, setMaxBuyAmount] = useOfferPreferences(
    (state) => [state.buyPreferences.amount, state.setMinBuyAmount, state.setMaxBuyAmount],
    shallow,
  )
  const [minTradingAmount, maxTradingAmount] = useConfigStore(
    (state) => [state.minTradingAmount, state.maxTradingAmount],
    shallow,
  )
  const rangeRules = useMemo(
    () => ({ min: minTradingAmount, max: maxTradingAmount, required: true }),
    [minTradingAmount, maxTradingAmount],
  )

  const [currentMinAmount, setCurrentMinAmount, minAmountValid] = useValidatedState(minBuyAmount, rangeRules)
  const [currentMaxAmount, setCurrentMaxAmount, maxAmountValid] = useValidatedState(maxBuyAmount, rangeRules)

  useDebounce(currentMinAmount, setMinBuyAmount, 400)
  useDebounce(currentMaxAmount, setMaxBuyAmount, 400)

  const setSelectedRange = useCallback(
    ([min, max]: [number, number]) => {
      setCurrentMinAmount(min)
      setCurrentMaxAmount(max)
    },
    [setCurrentMaxAmount, setCurrentMinAmount],
  )

  const next = () => navigation.navigate('buyPreferences')

  if (currentMaxAmount === Infinity) {
    setCurrentMinAmount(minBuyAmount)
    setCurrentMaxAmount(maxBuyAmount)
    return <LoadingScreen />
  }

  return (
    <View testID="view-buy" style={tw`flex h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`px-8 mt-2`}>
        <BitcoinPriceStats />
      </View>
      <RangeAmount
        style={tw`flex-shrink h-full mt-4 mb-2`}
        min={minTradingAmount}
        max={maxTradingAmount}
        value={[currentMinAmount, currentMaxAmount]}
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
        <PrimaryButton disabled={!minAmountValid || !maxAmountValid} testID="navigation-next" onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
