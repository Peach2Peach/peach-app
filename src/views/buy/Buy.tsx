import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { BitcoinPriceStats, Hint, HorizontalLine, PeachScrollView, PrimaryButton, Text } from '../../components'
import { RangeAmount } from '../../components/inputs/RangeAmount'
import { MAXTRADINGAMOUNT, MINTRADINGAMOUNT } from '../../constants'
import { useNavigation, useValidatedState } from '../../hooks'
import { account, updateSettings } from '../../utils/account'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useBuySetup } from './hooks/useBuySetup'

const rangeRules = { min: MINTRADINGAMOUNT, max: MAXTRADINGAMOUNT, required: true }

export default (): ReactElement => {
  const navigation = useNavigation()
  useBuySetup()

  const [minAmount, setMinAmount, minAmountValid] = useValidatedState(account.settings.minAmount, rangeRules)
  const [maxAmount, setMaxAmount, maxAmountValid] = useValidatedState(account.settings.maxAmount, rangeRules)
  const setSelectedRange = ([min, max]: [number, number]) => {
    setMinAmount(min)
    setMaxAmount(max)
  }
  const [showBackupReminder, setShowBackupReminder] = useState(account.settings.showBackupReminder !== false)

  const goToBackups = () => navigation.navigate('backups')
  const dismissBackupReminder = () => {
    updateSettings({ showBackupReminder: false }, true)
    setShowBackupReminder(false)
  }

  const next = () => {
    updateSettings({ minAmount, maxAmount }, true)
    navigation.navigate('buyPreferences', { amount: [minAmount, maxAmount] })
  }

  return (
    <View testID="view-buy" style={tw`flex h-full`}>
      <HorizontalLine style={tw`mx-8 mb-2`} />
      <PeachScrollView style={tw`flex-shrink h-full`} contentContainerStyle={tw`px-8`}>
        <BitcoinPriceStats />
        <View style={tw`flex h-full pb-8 pt-7`}>
          <Text style={tw`h6`}>
            {i18n('buy.subtitle')}
            <Text style={tw`h6 text-success-main`}> {i18n('buy')}</Text>?
          </Text>
          <RangeAmount
            style={tw`h-[300px] flex-shrink`}
            min={MINTRADINGAMOUNT}
            max={MAXTRADINGAMOUNT}
            value={[minAmount, maxAmount]}
            onChange={setSelectedRange}
          />
          {showBackupReminder && (
            <Hint
              style={tw`self-center max-w-xs mt-2`}
              title={i18n('hint.backup.title')}
              text={i18n('hint.backup.text')}
              icon="lock"
              onPress={goToBackups}
              onDismiss={dismissBackupReminder}
            />
          )}
        </View>
      </PeachScrollView>
      <PrimaryButton
        disabled={!minAmountValid || !maxAmountValid}
        testID="navigation-next"
        style={tw`self-center mx-6 mt-4 mb-10 bg-white-1`}
        onPress={next}
        narrow
      >
        {i18n('next')}
      </PrimaryButton>
      <DailyTradingLimit />
    </View>
  )
}
