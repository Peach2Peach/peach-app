import React, {
  ReactElement, useContext,
  useEffect, useState
} from 'react'
import {
  Pressable, View
} from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Button, Dropdown, Headline, Icon, Progress, SatsFormat, Text, Title } from '../../components'
import Hint from '../../components/Hint'
import { BUCKETS, DEPRECATED_BUCKETS } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import { OverlayContext } from '../../contexts/overlay'
import { account, getTradingLimit, updateSettings } from '../../utils/account'
import { applyTradingLimit } from '../../utils/account/tradingLimit'
import { StackNavigation } from '../../utils/navigation'
import { thousands } from '../../utils/string'
import Sats from '../../overlays/info/Sats'


type Props = {
  navigation: StackNavigation,
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  const [{ currency, satsPerUnit, prices }] = useContext(BitcoinContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const { daily, dailyAmount } = getTradingLimit(currency)
  const [amount, setAmount] = useState(account.settings.amount || BUCKETS[0])
  const [random, setRandom] = useState(0)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const onChange = (value: string|number) => setAmount(value as number)
  const onToggle = (isOpen: boolean) => setDropdownOpen(isOpen)

  const allowedSellBuckets = BUCKETS.filter(b => DEPRECATED_BUCKETS.indexOf(b) === -1)
  const dropdownItems = applyTradingLimit(allowedSellBuckets, prices.CHF as number, getTradingLimit()).map(value => ({
    value,
    display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
      <SatsFormat sats={value} format="big"/>
      {isOpen && satsPerUnit
        ? <Text style={tw`font-mono text-peach-1`}>
          {i18n(`currency.format.${currency}`, String(Math.round(value / satsPerUnit)))}
        </Text>
        : null
      }
    </View>
  }))

  const openSatsHelp = () => updateOverlay({ content: <Sats view="seller" />, showCloseButton: true, help: true })
  const goToBackups = () => navigation.navigate('backups', {})
  const dismissBackupReminder = () => {
    updateSettings({ showBackupReminder: false }, true)
    setRandom(Math.random())
  }

  const next = () => {
    navigation.navigate('sellPreferences', { amount })
  }

  useEffect(() => {
    updateSettings({ amount }, true)
  }, [amount])

  return <View testID="view-sell" style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink z-20`}>
      {!isNaN(dailyAmount)
        ? <View style={tw`h-0`}><Progress
          percent={dailyAmount / daily}
          text={i18n(
            'profile.tradingLimits.daily',
            currency, thousands(dailyAmount), daily === Infinity ? '∞' : thousands(daily)
          )}
        /></View>
        : null
      }
      <View style={tw`h-full pt-7 pb-8 flex`}>
        <Title title={i18n('sell.title')} />
        <View style={tw`h-full flex-shrink flex justify-center z-10`}>
          <View>
            <Headline style={tw`mt-16 text-grey-1 px-5`}>
              {i18n('sell.subtitle')}
            </Headline>
            <View style={tw`z-10`}>
              <View style={tw`w-full absolute flex-row items-start justify-center mt-3`}>
                <Dropdown
                  testID="sell-amount"
                  style={tw`max-w-70 flex-shrink`}
                  items={dropdownItems}
                  selectedValue={amount}
                  onChange={onChange} onToggle={onToggle}
                />
                <Pressable onPress={openSatsHelp} style={tw`p-3`}>
                    <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
                </Pressable>
              </View>
            </View>
            {satsPerUnit
              ? <Text style={tw`mt-4 mt-16 font-mono text-peach-1 text-center`}>
                ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
              </Text>
              : null
            }
          </View>
        </View>
        {account.settings.showBackupReminder !== false
          ? <View style={tw`flex items-center mt-2`}>
            <Hint
              style={tw`max-w-xs`}
              title={i18n('hint.backup.title')}
              text={i18n('hint.backup.text')}
              icon="lock"
              onPress={goToBackups}
              onDismiss={dismissBackupReminder}
            />
          </View>
          : null
        }
      </View>
    </View>
    <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
      <Button testID="navigation-next"
        wide={false}
        onPress={next}
        title={i18n('next')}
      />
    </View>
  </View>
}
