import { ReactElement, useCallback, useEffect, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { shallow } from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, Icon, PrimaryButton, Text } from '../../components'
import { RangeAmount } from '../../components/inputs/verticalAmountSelector/RangeAmount'
import { useNavigation, useValidatedState } from '../../hooks'
import { useConfigStore } from '../../store/configStore'
import { useSettingsStore } from '../../store/settingsStore'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useBuySetup } from './hooks/useBuySetup'
import LoadingScreen from '../loading/LoadingScreen'
import { useCheckShowRedesignWelcome } from '../../hooks/'
import { useShowBackupReminder } from '../../hooks/useShowBackupReminder'
import { useDebounce } from '../../hooks/useDebounce'
import { ProgressDonut } from '../../components/ui'

export default (): ReactElement => {
  const navigation = useNavigation()
  const checkShowRedesignWelcome = useCheckShowRedesignWelcome()
  const showCorrectBackupReminder = useShowBackupReminder()

  const { freeTrades, maxFreeTrades } = useBuySetup()

  const [showBackupReminder, minBuyAmount, setMinBuyAmount, maxBuyAmount, setMaxBuyAmount] = useSettingsStore(
    (state) => [
      state.showBackupReminder,
      state.minBuyAmount,
      state.setMinBuyAmount,
      state.maxBuyAmount,
      state.setMaxBuyAmount,
    ],
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

  useEffect(() => {
    checkShowRedesignWelcome()
  }, [checkShowRedesignWelcome])

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

  return currentMaxAmount === Infinity ? (
    <LoadingScreen />
  ) : (
    <View testID="view-buy" style={tw`flex h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`px-8 mt-2`}>
        <BitcoinPriceStats />
      </View>
      <RangeAmount
        style={tw`h-full flex-shrink mt-4 mb-2`}
        min={minTradingAmount}
        max={maxTradingAmount}
        value={[currentMinAmount, currentMaxAmount]}
        onChange={setSelectedRange}
      />
      <View style={[tw`flex-row items-center justify-center mt-4 mb-1`, tw.md`mb-4`]}>
        {freeTrades > 0 && (
          <ProgressDonut
            style={tw`absolute left-5 bottom-0`}
            title={i18n('settings.referrals.noPeachFees.freeTrades')}
            value={freeTrades}
            max={maxFreeTrades}
          />
        )}
        <PrimaryButton disabled={!minAmountValid || !maxAmountValid} testID="navigation-next" onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && (
          <View style={tw`justify-center`}>
            <TouchableOpacity style={tw`absolute left-4`} onPress={showCorrectBackupReminder}>
              <Icon id="alertTriangle" style={tw`w-8 h-8`} color={tw`text-warning-main`.color} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
