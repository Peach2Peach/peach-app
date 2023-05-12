import { ReactElement, useCallback, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, Icon, PrimaryButton } from '../../components'
import { SelectAmount } from '../../components/inputs/verticalAmountSelector/SelectAmount'
import { useNavigation, useValidatedState } from '../../hooks'
import { useDebounce } from '../../hooks/useDebounce'
import { useShowBackupReminder } from '../../hooks/useShowBackupReminder'
import { useConfigStore } from '../../store/configStore'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import LoadingScreen from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useSellSetup } from './hooks/useSellSetup'

export default (): ReactElement => {
  const navigation = useNavigation()

  const showCorrectBackupReminder = useShowBackupReminder()

  useSellSetup({ help: 'sellingBitcoin', hideGoBackButton: true })

  const [showBackupReminder, sellAmount, setSellAmount] = useSettingsStore(
    (state) => [state.showBackupReminder, state.sellAmount, state.setSellAmount],
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
  const [amount, setAmount, amountValid] = useValidatedState(sellAmount, rangeRules)

  useDebounce(amount, setSellAmount, 400)

  const setSelectedAmount = useCallback(
    (value: number) => {
      setAmount(value)
    },
    [setAmount],
  )
  const next = () => navigation.navigate('sellPreferences')

  return minTradingAmount === 0 ? (
    <LoadingScreen />
  ) : (
    <View testID="view-sell" style={tw`h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`px-8 mt-2`}>
        <BitcoinPriceStats />
      </View>
      <SelectAmount
        style={tw`h-full flex-shrink mt-4 mb-2`}
        min={minTradingAmount}
        max={maxTradingAmount}
        value={amount}
        onChange={setSelectedAmount}
      />
      <View style={tw`flex-row items-center justify-center mt-4 mb-1 md:mb-4`}>
        <PrimaryButton disabled={!amountValid} testID="navigation-next" onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && (
          <View style={tw`justify-center`}>
            <TouchableOpacity style={tw`absolute left-4`} onPress={showCorrectBackupReminder}>
              <Icon id="alertTriangle" style={tw`w-8 h-8`} color={tw.color('warning-main')} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
