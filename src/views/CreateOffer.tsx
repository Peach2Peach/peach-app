import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

import { Button, Dropdown, Headline, Icon, Progress, Text, Title, Hint, SatsFormat } from '../components'
import { BUCKETS, DEPRECATED_BUCKETS } from '../constants'
import BitcoinContext from '../contexts/bitcoin'
import { OverlayContext } from '../contexts/overlay'
import Sats from '../overlays/info/Sats'
import { account, getTradingLimit, updateSettings } from '../utils/account'
import { StackNavigation } from '../utils/navigation'
import { thousands } from '../utils/string'
import { applyTradingLimit } from '../utils/account/tradingLimit'

type Props = {
  navigation: StackNavigation
  page: 'buy' | 'sell'
}

export default ({ navigation, page }: Props): ReactElement => {
  const [{ currency, satsPerUnit, prices }] = useContext(BitcoinContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const { daily, dailyAmount } = getTradingLimit(currency)
  const [amount, setAmount] = useState(
    BUCKETS.includes(account.settings.amount || 0) ? account.settings.amount : BUCKETS[0],
  )
  const [showBackupReminder, setShowBackupReminder] = useState(account.settings.showBackupReminder !== false)

  const allowedBuckets = page === 'sell' ? BUCKETS.filter((b) => DEPRECATED_BUCKETS.indexOf(b) === -1) : BUCKETS
  const dropdownItems = applyTradingLimit(allowedBuckets, prices.CHF as number, getTradingLimit()).map((value) => ({
    value,
    display: (isOpen: boolean) => (
      <View style={tw`flex-row justify-between items-center`}>
        <SatsFormat sats={value} format="big" />
        {isOpen && satsPerUnit ? (
          <Text style={tw`font-mono text-peach-1`}>
            {i18n(`currency.format.${currency}`, String(Math.round(value / satsPerUnit)))}
          </Text>
        ) : null}
      </View>
    ),
  }))

  const openSatsHelp = () => updateOverlay({ content: <Sats view={`${page}er`} />, showCloseButton: true, help: true })
  const goToBackups = () => navigation.navigate('backups', {})
  const dismissBackupReminder = () => {
    updateSettings({ showBackupReminder: false }, true)
    setShowBackupReminder(false)
  }

  const next = () => {
    navigation.navigate(`${page}Preferences`, { amount })
  }

  useEffect(() => {
    updateSettings({ amount }, true)
  }, [amount])

  return (
    <View testID={`view-${page}`} style={tw`h-full flex`}>
      <View style={tw`h-full flex-shrink z-20`}>
        {!isNaN(dailyAmount) ? (
          <View style={tw`h-0`}>
            <Progress
              percent={dailyAmount / daily}
              text={i18n(
                'profile.tradingLimits.daily',
                currency,
                thousands(dailyAmount),
                daily === Infinity ? '∞' : thousands(daily),
              )}
            />
          </View>
        ) : null}
        <View style={tw`h-full pt-7 pb-8 flex`}>
          <Title title={i18n(`${page}.title`)} />
          <View style={tw`h-full flex-shrink flex justify-center z-10`}>
            <View>
              <Headline style={tw`mt-16 text-grey-1 px-5`}>{i18n(`${page}.subtitle`)}</Headline>
              <View style={tw`z-10`}>
                <View style={tw`w-full absolute flex-row items-start justify-center mt-3`}>
                  <Dropdown
                    testID={`${page}-amount`}
                    style={tw`max-w-70 flex-shrink`}
                    items={dropdownItems}
                    selectedValue={amount}
                    onChange={setAmount}
                  />
                  <Pressable onPress={openSatsHelp} style={tw`p-3`}>
                    <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
                  </Pressable>
                </View>
              </View>
              {satsPerUnit ? (
                <Text style={tw`mt-4 mt-16 font-mono text-peach-1 text-center`}>
                  ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
                </Text>
              ) : null}
            </View>
          </View>
          {showBackupReminder && (
            <View style={tw`flex items-center mt-2`}>
              <Hint
                style={tw`max-w-xs`}
                title={i18n('hint.backup.title')}
                text={i18n('hint.backup.text')}
                icon="lock"
                onPress={goToBackups}
                onDismiss={dismissBackupReminder}
              />
            </View>
          )}
        </View>
      </View>
      <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
        <Button testID="navigation-next" wide={false} onPress={next} title={i18n('next')} />
      </View>
    </View>
  )
}
