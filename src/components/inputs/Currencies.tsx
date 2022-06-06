import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { CURRENCIES } from '../../constants'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Item } from './Item'

type CurrenciesProps = ComponentProps & {
  currencies?: Currency[],
  selected: Currency,
  onChange: (currency: Currency) => void,
  meansOfPayment: MeansOfPayment,
  invertColors?: boolean,
}
export const Currencies = ({
  currencies = CURRENCIES,
  selected,
  onChange,
  meansOfPayment,
  invertColors
}: CurrenciesProps): ReactElement => {
  const triangleColor = (invertColors ? tw`text-white-1` : tw`text-peach-1`).color as string

  return <View style={tw`flex-row justify-center`}>
    {currencies.map((c, i) => <View key={c} style={i > 0 ? tw`ml-2` : {}}>
      <Item
        label={c}
        isSelected={(meansOfPayment as Required<MeansOfPayment>)[c]?.length > 0}
        onPress={() => onChange(c)}
        style={tw`w-16`}
        invertColors={invertColors}
      />
      {c === selected
        ? <View style={tw`absolute top-full mt-2 w-full flex items-center`}>
          <Icon id="triangleDown" color={triangleColor}
            style={tw`w-3 h-3 opacity-70`}
          />
        </View>
        : null
      }
    </View>
    )}
  </View>
}