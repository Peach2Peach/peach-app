import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

import { PrimaryButton, Dropdown, Headline, Hint, Progress, SatsFormat, Text, Title } from '../components'
import { BUCKETS, DEPRECATED_BUCKETS } from '../constants'
import BitcoinContext from '../contexts/bitcoin'
import { account, getTradingLimit, updateSettings } from '../utils/account'
import { applyTradingLimit } from '../utils/account/tradingLimit'
import { StackNavigation } from '../utils/navigation'
import { thousands } from '../utils/string'
import { useHeaderState } from '../components/header/store'
import { useFocusEffect } from '@react-navigation/native'
import { IconType } from '../components/icons'

type Props = {
  navigation: StackNavigation
  page: 'buy' | 'sell'
}

const useHeaderSetup = (page: 'buy' | 'sell') => {
  const setHeaderState = useHeaderState((state) => state.setHeaderState)

  const titleComponent = useMemo(
    () => (
      <Text style={tw`h6`}>
        <Text style={[tw`h6`, page === 'buy' ? tw`text-success-light` : tw`text-primary-main`]}>{page}</Text> bitcoin
      </Text>
    ),
    [page],
  )

  const icons = useMemo(() => {
    let defaultIcons = [
      { iconId: 'alignLeft', onPress: () => null },
      { iconId: 'helpCircle', onPress: () => null },
    ]
    if (page === 'buy') defaultIcons = [{ iconId: 'bellSmall' as IconType, onPress: () => null }, ...defaultIcons]
    return defaultIcons as {
      iconId: IconType
      onPress: () => void
    }[]
  }, [page])

  useFocusEffect(
    useCallback(() => {
      setHeaderState({ titleComponent, icons })
    }, [icons, setHeaderState, titleComponent]),
  )
}

export default ({ navigation, page }: Props): ReactElement => {
  const [{ currency, satsPerUnit, prices }] = useContext(BitcoinContext)
  useHeaderSetup(page)

  const { daily, dailyAmount } = getTradingLimit(currency)
  const [amount, setAmount] = useState(
    account.settings.amount && BUCKETS.includes(account.settings.amount) ? account.settings.amount : BUCKETS[0],
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
                <View style={tw`w-full absolute px-6 flex-row items-start justify-center mt-3`}>
                  <Dropdown
                    testID={`${page}-amount`}
                    style={tw`flex-shrink`}
                    items={dropdownItems}
                    selectedValue={amount}
                    onChange={setAmount}
                  />
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
      <PrimaryButton testID="navigation-next" style={tw`mt-4 mx-6 mb-10 self-center bg-white-1`} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
