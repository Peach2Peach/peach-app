import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import {
  BitcoinPriceStats,
  Headline,
  Hint,
  HorizontalLine,
  PeachScrollView,
  PrimaryButton,
  Text,
  Title,
} from '../../components'
import { SelectAmount } from '../../components/inputs/SelectAmount'
import { MAXTRADINGAMOUNT, MINTRADINGAMOUNT } from '../../constants'
import { useNavigation, useValidatedState } from '../../hooks'
import { account, updateSettings } from '../../utils/account'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useSellSetup } from './hooks/useSellSetup'

const rangeRules = { min: MINTRADINGAMOUNT, max: MAXTRADINGAMOUNT, required: true }

export default (): ReactElement => {
  const navigation = useNavigation()

  useSellSetup()

  const [amount, setAmount, amountValid] = useValidatedState(account.settings.minAmount, rangeRules)
  const [showBackupReminder, setShowBackupReminder] = useState(account.settings.showBackupReminder !== false)

  useEffect(() => {
    updateSettings({ minAmount: amount }, true)
  }, [amount])

  const goToBackups = () => navigation.navigate('backups')
  const dismissBackupReminder = () => {
    updateSettings({ showBackupReminder: false }, true)
    setShowBackupReminder(false)
  }

  const next = () => {
    navigation.navigate('sellPreferences', { amount })
  }

  return (
    <View testID="view-sell" style={tw`flex h-full`}>
      <HorizontalLine style={tw`mx-8 mb-2`} />
      <PeachScrollView style={tw`flex-shrink h-full px-8`}>
        <BitcoinPriceStats />
        <View style={tw`flex h-full pb-8 pt-7`}>
          <View style={tw`z-10 flex justify-center flex-shrink h-full`}>
            <View>
              <Text style={tw`h6`}>
                {i18n('sell.subtitle')}
                <Text style={tw`h6 text-primary-main`}> {i18n('sell')}</Text>?
              </Text>
              <View style={tw`absolute z-10 flex-row items-start justify-center w-full px-6 mt-3`}></View>
              <SelectAmount
                {...{
                  min: MINTRADINGAMOUNT,
                  max: MAXTRADINGAMOUNT,
                  value: amount,
                  onChange: setAmount,
                }}
              />
            </View>
          </View>
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
        disabled={!amountValid}
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
