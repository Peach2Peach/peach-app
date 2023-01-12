import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Dropdown, Headline, Hint, PrimaryButton, Progress, SatsFormat, Text, Title } from '../../components'
import { BUCKETS, DEPRECATED_BUCKETS } from '../../constants'
import { useHeaderSetup, useNavigation } from '../../hooks'
import { account, getTradingLimit, updateSettings } from '../../utils/account'
import { applyTradingLimit } from '../../utils/account/tradingLimit'
import { thousands } from '../../utils/string'
import { getHeaderIcons } from './getHeaderIcons'
import TitleComponent from './TitleComponent'
import shallow from 'zustand/shallow'
import { useBitcoinStore } from '../../store/bitcoinStore'

type Props = {
  page: 'buy' | 'sell'
}

export default ({ page }: Props): ReactElement => {
  const navigation = useNavigation()
  const [currency, satsPerUnit, prices] = useBitcoinStore(
    (state) => [state.currency, state.satsPerUnit, state.prices],
    shallow,
  )

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <TitleComponent page={page} />,
        hideGoBackButton: true,
        icons: getHeaderIcons(page),
      }),
      [page],
    ),
  )

  const { daily, dailyAmount } = getTradingLimit(currency)
  const [amount, setAmount] = useState(
    account.settings.amount && BUCKETS.includes(account.settings.amount) ? account.settings.amount : BUCKETS[0],
  )
  const [showBackupReminder, setShowBackupReminder] = useState(account.settings.showBackupReminder !== false)

  const allowedBuckets = page === 'sell' ? BUCKETS.filter((b) => !DEPRECATED_BUCKETS.includes(b)) : BUCKETS
  const dropdownItems = applyTradingLimit(allowedBuckets, prices.CHF as number, getTradingLimit()).map((value) => ({
    value,
    display: (isOpen: boolean) => (
      <View style={tw`flex-row items-center justify-between`}>
        <SatsFormat sats={value} format="big" />
        {isOpen && satsPerUnit ? (
          <Text style={tw`font-mono text-peach-1`}>
            {i18n(`currency.format.${currency}`, String(Math.round(value / satsPerUnit)))}
          </Text>
        ) : null}
      </View>
    ),
  }))

  useEffect(() => {
    updateSettings({ amount }, true)
  }, [amount])

  const goToBackups = () => navigation.navigate('backups')
  const dismissBackupReminder = () => {
    updateSettings({ showBackupReminder: false }, true)
    setShowBackupReminder(false)
  }

  const next = () => {
    navigation.navigate(`${page}Preferences`, { amount })
  }

  return (
    <View testID={`view-${page}`} style={tw`flex h-full`}>
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
          <Title title={i18n(`${page}.title`)} />
          <View style={tw`z-10 flex justify-center flex-shrink h-full`}>
            <View>
              <Headline style={tw`px-5 mt-16 text-grey-1`}>{i18n(`${page}.subtitle`)}</Headline>
              <View style={tw`absolute z-10 flex-row items-start justify-center w-full px-6 mt-3`}>
                <Dropdown
                  testID={`${page}-amount`}
                  style={tw`flex-shrink`}
                  items={dropdownItems}
                  selectedValue={amount}
                  onChange={setAmount}
                />
              </View>
              {satsPerUnit ? (
                <Text style={tw`mt-4 mt-16 font-mono text-center text-peach-1`}>
                  ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
                </Text>
              ) : null}
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
      <PrimaryButton testID="navigation-next" style={tw`self-center mx-6 mt-4 mb-10 bg-white-1`} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
