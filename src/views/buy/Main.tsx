import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Dropdown, SatsFormat, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { BUCKETS } from '../../constants'
import { getBitcoinContext } from '../../utils/bitcoin'
import { BuyViewProps } from './Buy'
import { account, updateSettings } from '../../utils/account'

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  useContext(LanguageContext)
  const { currency, satsPerUnit } = getBitcoinContext()
  const [amount, setAmount] = useState(account.settings.amount || offer.amount)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    updateOffer({ ...offer, amount })
    updateSettings({ amount })
    setStepValid(true)
  }, [amount])

  useEffect(() => {
    updateOffer({ ...offer, amount })
  }, [])

  return <View>
    <Title title={i18n('buy.title')} subtitle={i18n('buy.subtitle')} />
    <View style={tw`z-20 my-24`}>
      <View style={tw`flex items-center`}>
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