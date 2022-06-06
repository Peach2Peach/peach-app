import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Dropdown, Headline, SatsFormat, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { BUCKETS, DEPRECATED_BUCKETS } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import { SellViewProps } from './Sell'
import { getTradingLimit, updateSettings } from '../../utils/account'
import { applyTradingLimit } from '../../utils/account/tradingLimit'

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [{ currency, satsPerUnit, prices }] = useContext(BitcoinContext)
  const [amount, setAmount] = useState(offer.amount)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    updateOffer({ ...offer, amount })
    updateSettings({ amount }, true)
    setStepValid(true)
  }, [amount])

  useEffect(() => {
    setStepValid(true)
  }, [])


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

  return <View style={tw`h-full flex`}>
    <Title title={i18n('sell.title')} />
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <View>
        <Headline style={tw`mt-16 text-grey-1 px-5`}>
          {i18n('sell.subtitle')}
        </Headline>
        <View style={tw`z-10`}>
          <View style={tw`w-full absolute flex items-center px-12 mt-3`}>
            <Dropdown
              items={dropdownItems}
              selectedValue={amount}
              onChange={onChange} onToggle={onToggle}
            />
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
  </View>
}