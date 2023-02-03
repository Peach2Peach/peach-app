import React, { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import shallow from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, Icon, PrimaryButton, Text } from '../../components'
import { SelectAmount } from '../../components/inputs/verticalAmountSelector/SelectAmount'
import { MAXTRADINGAMOUNT, MINTRADINGAMOUNT } from '../../constants'
import { useNavigation, useValidatedState } from '../../hooks'
import { useShowWarning } from '../../hooks/useShowWarning'
import { useSettingsStore } from '../../store/settingsStore'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useSellSetup } from './hooks/useSellSetup'

const rangeRules = { min: MINTRADINGAMOUNT, max: MAXTRADINGAMOUNT, required: true }

export default (): ReactElement => {
  const navigation = useNavigation()
  const showBackupsWarning = useShowWarning('backups')
  useSellSetup({ help: 'buyingAndSelling', hideGoBackButton: true })

  const [showBackupReminder, minAmount, setMinAmount] = useSettingsStore(
    (state) => [state.showBackupReminder, state.minAmount, state.setMinAmount],
    shallow,
  )
  const [amount, setAmount, amountValid] = useValidatedState(minAmount, rangeRules)

  const next = () => {
    setMinAmount(amount)
    navigation.navigate('sellPreferences')
  }

  return (
    <View testID="view-sell" style={tw`h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`mt-2 px-8`}>
        <BitcoinPriceStats />
        <View style={tw`pt-4`}>
          <Text style={[tw`hidden h6`, tw.md`flex`]}>
            {i18n('sell.subtitle')}
            <Text style={tw`h6 text-primary-main`}> {i18n('sell')}</Text>?
          </Text>
        </View>
      </View>
      <View style={tw`flex-grow items-center justify-center`}>
        <SelectAmount min={MINTRADINGAMOUNT} max={MAXTRADINGAMOUNT} value={amount} onChange={setAmount} />
      </View>
      <View style={[tw`flex-row items-center justify-center mt-4 mb-1`, tw.md`mb-10`]}>
        <PrimaryButton disabled={!amountValid} testID="navigation-next" onPress={next} narrow>
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
