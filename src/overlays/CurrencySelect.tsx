import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, HorizontalLine, Icon, PeachScrollView, Text } from '../components'
import i18n from '../utils/i18n'
import { CURRENCIES } from '../constants'
import { OverlayContext } from '../contexts/overlay'

type ToggleProps = ComponentProps & {
  label: string,
  value: string,
  active: boolean,
  onToggle: (value: string) => void
}

const Toggle = ({ label, value, active, onToggle, style }: ToggleProps) => {
  const elementStyle = tw`h-10 px-4 flex items-center justify-center border border-white-1 rounded`
  const textStyle = [tw`font-baloo text-sm`, active ? tw`text-peach-1` : tw`text-white-1`]

  const toggle = () => onToggle(value)
  return <Pressable onPress={toggle} style={[tw`w-full flex-row`, style]}>
    <View style={[elementStyle, tw`mr-3`, active ? tw`bg-white-1` : {}]}>
      <Text style={textStyle}>{active ? '-' : '+'}</Text>
    </View>
    <View style={[elementStyle, tw`w-full flex-shrink`, active ? tw`bg-white-1` : {}]}>
      <Text style={textStyle}>{label}</Text>
    </View>
  </Pressable>
}

type CurrencySelectProps = {
  currencies?: Currency[],
  onConfirm: (currencies: Currency[]) => void
}

// TODO add search
export default ({ currencies = [], onConfirm }: CurrencySelectProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [selectedCurrencies, setSelectedCurrencies] = useState<Currency[]>(currencies)
  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const toggleCurrency = (c: Currency) => setSelectedCurrencies(cs => {
    if (cs.indexOf(c) === -1) {
      cs.push(c)
    } else {
      cs = cs.filter(item => item !== c)
    }
    return [...cs]
  })

  const confirm = () => {
    onConfirm(selectedCurrencies)
  }

  return <View style={tw`w-full h-full pt-14 pb-8 flex items-center justify-between`}>
    <View style={tw`w-full`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('currency.select.title')}
      </Headline>
      <View style={tw`px-10`}>
        <HorizontalLine style={tw`bg-white-1 opacity-50 mt-4`}/>
      </View>
      <PeachScrollView style={tw`px-10`}>
        <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl mt-5`}>
          {i18n('country.EU')}
        </Headline>
        <View style={tw`px-5`}>
          {CURRENCIES.map((currency, i) => <Toggle key={currency}
            style={tw`mt-3`}
            label={i18n(`currency.${currency}`)}
            value={currency}
            onToggle={c => toggleCurrency(c as Currency)}
            active={selectedCurrencies.indexOf(currency) !== -1} />)}
        </View>
      </PeachScrollView>
    </View>
    <View style={tw`w-full`}>
      <View style={tw`px-10`}>
        <HorizontalLine style={tw`bg-white-1 mt-4`}/>
      </View>
      <View style={tw`w-full mt-10 flex items-center`}>
        <Pressable style={tw`absolute left-0`} onPress={closeOverlay}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('confirm')}
          secondary={true}
          disabled={selectedCurrencies.length === 0}
          onPress={confirm}
          wide={false}
        />
      </View>
    </View>
  </View>
}