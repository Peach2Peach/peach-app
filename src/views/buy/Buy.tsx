import { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, PrimaryButton } from '../../components'
import { RangeAmount } from '../../components/inputs/verticalAmountSelector/RangeAmount'
import { ProgressDonut } from '../../components/ui'
import { useNavigation, useValidatedState } from '../../hooks'
import { useCheckShowRedesignWelcome } from '../../hooks/'
import { useDebounce } from '../../hooks/useDebounce'
import { useConfigStore } from '../../store/configStore'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import LoadingScreen from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { BackupReminderIcon } from './BackupReminderIcon'
import { useBuySetup } from './hooks/useBuySetup'
import { Psbt, networks } from 'bitcoinjs-lib'
import { NETWORK } from '@env'
import { getNetwork } from '../../utils/wallet'

export default () => {
  const navigation = useNavigation()
  const checkShowRedesignWelcome = useCheckShowRedesignWelcome()

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

  const createPSBT = () => {
    const psbt = new Psbt({
      network: networks.bitcoin,
    })
    psbt.addOutput({
      address: 'bc1qzmpu5ljvq8pee6wcax3nlgfmfjmqjyf3tssr9h',
      value: 100000,
    })
    psbt.addOutput({
      address: 'bc1q0gper2kpzl8z6kn2zglcnhrs6hera5fj3yfj5q',
      value: 100000,
    })
    psbt.addOutput({
      address: 'bc1qsh8pqlkt35hmpftsuyy8wecfw033sdvc2jwjgz',
      value: 100000,
    })
    console.log(psbt.toBase64())
  }
  return currentMaxAmount === Infinity ? (
    <LoadingScreen />
  ) : (
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
        <PrimaryButton
          disabled={!minAmountValid || !maxAmountValid}
          testID="navigation-next"
          onPress={createPSBT}
          narrow
        >
          {i18n('fakePSBT')}
        </PrimaryButton>
        <PrimaryButton disabled={!minAmountValid || !maxAmountValid} testID="navigation-next" onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
