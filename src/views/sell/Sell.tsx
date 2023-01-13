import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import shallow from 'zustand/shallow'
import { Headline, Hint, PrimaryButton, Progress, Title } from '../../components'
import { SelectAmount } from '../../components/inputs/SelectAmount'
import { MAXTRADINGAMOUNT, MINTRADINGAMOUNT } from '../../constants'
import { useHeaderSetup, useNavigation, useValidatedState } from '../../hooks'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { account, getTradingLimit, updateSettings } from '../../utils/account'
import { thousands } from '../../utils/string'
import { getSellHeaderIcons } from './components/getSellHeaderIcons'
import SellTitleComponent from './components/SellTitleComponent'

const rangeRules = { min: MINTRADINGAMOUNT, max: MAXTRADINGAMOUNT, required: true }

export default (): ReactElement => {
  const navigation = useNavigation()
  const [currency, satsPerUnit, prices] = useBitcoinStore(
    (state) => [state.currency, state.satsPerUnit, state.prices],
    shallow,
  )

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <SellTitleComponent />,
        hideGoBackButton: true,
        icons: getSellHeaderIcons(),
      }),
      [],
    ),
  )

  const { daily, dailyAmount } = getTradingLimit(currency)
  const [amount, setAmount, amountValid] = useValidatedState(account.settings.minAmount, rangeRules)
  const [showBackupReminder, setShowBackupReminder] = useState(account.settings.showBackupReminder !== false)
  // console.log(getTradingLimit())

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
      <View style={tw`z-20 flex-shrink h-full`}>
        {!isNaN(dailyAmount) ? (
          <View style={tw`h-0`}>
            <Progress
              percent={dailyAmount / daily}
              color={tw`bg-primary-main`}
              text={i18n(
                'profile.tradingLimits.daily',
                currency,
                thousands(dailyAmount),
                daily === Infinity ? '∞' : thousands(daily),
              )}
            />
          </View>
        ) : null}
        <View style={tw`flex h-full pb-8 pt-7`}>
          <Title title={i18n('sell.title')} />
          <View style={tw`z-10 flex justify-center flex-shrink h-full`}>
            <View>
              <Headline style={tw`px-5 mt-16 text-grey-1`}>{i18n('sell.subtitle')}</Headline>
              <View style={tw`absolute z-10 flex-row items-start justify-center w-full px-6 mt-3`}></View>
              <SelectAmount
                {...{
                  min: MINTRADINGAMOUNT,
                  max: MAXTRADINGAMOUNT,
                  value: amount,
                  onChange: setAmount,
                }}
              />
              {/* {satsPerUnit ? (
                <Text style={tw`mt-4 mt-16 font-mono text-center text-peach-1`}>
                  ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
                </Text>
              ) : null} */}
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
      </View>
      <PrimaryButton
        disabled={!amountValid}
        testID="navigation-next"
        style={tw`self-center mx-6 mt-4 mb-10 bg-white-1`}
        onPress={next}
        narrow
      >
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
