import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Dropdown, SatsFormat, Text } from '../../components'
import i18n from '../../utils/i18n'
import { BUCKETS } from '../../constants'
import { getBitcoinContext } from '../../components/bitcoin'
import { SellViewProps } from './Sell'
import { account, updateSettings } from '../../utils/accountUtils'

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const { currency, satsPerUnit } = getBitcoinContext()
  const amount = account.settings.amount || offer.amount

  const [dropdownOpen, setDropdownOpen] = useState(false)

  setStepValid(true)

  return <View style={tw`z-20 my-32`}>
    <View style={tw`flex items-center`}>
      <Dropdown
        selectedValue={amount}
        onChange={value => {
          updateSettings({ amount: value as number })
          updateOffer({
            ...offer,
            amount: value as number
          })
        }}
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
        ≈ {i18n(`currency.format.${currency}`, String(Math.round(offer.amount / satsPerUnit)))}
      </Text>
      : null
    }
  </View>
}