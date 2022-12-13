import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Button, Dropdown, Headline, Progress, SatsFormat, Text, Title } from '../../components'
import { BUCKETS, DEPRECATED_BUCKETS } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import { applyTradingLimit, getTradingLimit } from '../../utils/account'
import { StackNavigation } from '../../utils/navigation'
import { thousands } from '../../utils/string'
import { useUserDataStore } from '../../store'
import { BackupReminder } from './components/BackupReminder'

type Props = {
  navigation: StackNavigation
  page: 'buy' | 'sell'
}

export default ({ navigation, page }: Props): ReactElement => {
  const amount = useUserDataStore((state) =>
    state.settings.amount && BUCKETS.includes(state.settings.amount) ? state.settings.amount : BUCKETS[0],
  )
  const [{ currency, satsPerUnit, prices }] = useContext(BitcoinContext)

  const { daily, dailyAmount } = getTradingLimit(currency)

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

  const next = () => {
    navigation.navigate(`${page}Preferences`, { amount })
  }

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
                <View style={tw`w-full absolute px-6 flex-row items-start justify-center mt-3`}>
                  <Dropdown testID={`${page}-amount`} style={tw`flex-shrink`} items={dropdownItems} />
                </View>
              </View>
              {satsPerUnit ? (
                <Text style={tw`mt-4 mt-16 font-mono text-peach-1 text-center`}>
                  ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
                </Text>
              ) : null}
            </View>
          </View>
          <BackupReminder />
        </View>
      </View>
      <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
        <Button testID="navigation-next" wide={false} onPress={next} title={i18n('next')} />
      </View>
    </View>
  )
}
