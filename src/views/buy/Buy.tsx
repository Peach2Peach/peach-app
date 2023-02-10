import React, { ReactElement, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import shallow from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, Icon, PrimaryButton, Text } from '../../components'
import { RangeAmount } from '../../components/inputs/verticalAmountSelector/RangeAmount'
import { useNavigation, useOnUnmount, useValidatedState } from '../../hooks'
import { useShowWarning } from '../../hooks/useShowWarning'
import { useConfigStore } from '../../store/configStore'
import { useSettingsStore } from '../../store/settingsStore'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useBuySetup } from './hooks/useBuySetup'

export default (): ReactElement => {
  const navigation = useNavigation()
  const showBackupsWarning = useShowWarning('backups')

  useBuySetup()

  const [showBackupReminder, minAmount, setMinAmount, maxAmount, setMaxAmount] = useSettingsStore(
    (state) => [state.showBackupReminder, state.minAmount, state.setMinAmount, state.maxAmount, state.setMaxAmount],
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

  const [currentMinAmount, setCurrentMinAmount, minAmountValid] = useValidatedState(minAmount, rangeRules)
  const [currentMaxAmount, setCurrentMaxAmount, maxAmountValid] = useValidatedState(maxAmount, rangeRules)
  const setSelectedRange = ([min, max]: [number, number]) => {
    setCurrentMinAmount(min)
    setCurrentMaxAmount(max)
  }

  const next = () => navigation.navigate('buyPreferences')

  useOnUnmount((value: number) => {
    setMinAmount(value)
  }, currentMinAmount)
  useOnUnmount((value: number) => {
    setMaxAmount(value)
  }, currentMaxAmount)

  return (
    <View testID="view-buy" style={tw`flex h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`px-8 mt-2`}>
        <BitcoinPriceStats />
        <View style={tw`pt-4`}>
          <Text style={[tw`hidden h6`, tw.md`flex`]}>
            {i18n('buy.subtitle')}
            <Text style={tw`h6 text-success-main`}> {i18n('buy')}</Text>?
          </Text>
        </View>
      </View>
      <View style={tw`items-center justify-center flex-grow`}>
        <RangeAmount
          min={minTradingAmount}
          max={maxTradingAmount}
          value={[currentMinAmount, currentMaxAmount]}
          onChange={setSelectedRange}
        />
      </View>
      <View style={[tw`flex-row items-center justify-center mt-4 mb-1`, tw.md`mb-10`]}>
        <PrimaryButton disabled={!minAmountValid || !maxAmountValid} testID="navigation-next" onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && (
          <View style={tw`justify-center`}>
            <TouchableOpacity style={tw`absolute left-4`} onPress={showBackupsWarning}>
              <Icon id="alertTriangle" style={tw`w-8 h-8`} color={tw`text-warning-main`.color} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
