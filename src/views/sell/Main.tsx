import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Dropdown, Headline, SatsFormat, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { BUCKETS } from '../../constants'
import { getBitcoinContext } from '../../contexts/bitcoin'
import { SellViewProps } from './Sell'
import { updateSettings } from '../../utils/account'

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const { currency, satsPerUnit } = getBitcoinContext()
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

  return <View style={tw`h-full`}>
    <Title title={i18n('sell.title')} />
    <View style={tw`z-20`}>
      <Headline style={tw`mt-16 text-grey-1 px-5`}>
        {i18n('sell.subtitle')}
      </Headline>
      <View style={tw`h-10 w-full z-10 flex items-center px-12 mt-3`}>
        <Dropdown
          selectedValue={amount}
          onChange={value => setAmount(value as number)}
          onToggle={(isOpen) => setDropdownOpen(isOpen)}
          width={tw`w-80`.width as number}
          items={BUCKETS.map(value => ({
            value,
            display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
              <SatsFormat sats={value} format="big"/>
              {isOpen
                ? <Text style={tw`font-mono text-peach-1`}>
                  {i18n(`currency.format.${currency}`, String(Math.round(value / satsPerUnit)))}
                </Text>
                : null
              }
            </View>
          })
          )}
        />
      </View>
      {!dropdownOpen
        ? <Text style={tw`mt-4 font-mono text-peach-1 text-center`}>
          ≈ {i18n(`currency.format.${currency}`, String(Math.round(amount / satsPerUnit)))}
        </Text>
        : null
      }
    </View>
  </View>
}