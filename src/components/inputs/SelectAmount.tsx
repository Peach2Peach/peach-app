import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { innerShadow } from '../../utils/layout'
import { Text } from '../text'
import { Shadow } from '../ui'
import Input from './Input'

type SelectAmountProps = ComponentProps & {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

/**
 * @description Component to display a range selection
 * @example
 * <SelectAmount
    min={100000}
    max={2500000}
    value={amount}
    onChange={setAmount}
 */
export const SelectAmount = ({ min, max, value, onChange }: SelectAmountProps): ReactElement => {
  const change = (amount: string) => onChange(Number(amount))

  return (
    <View>
      <Shadow shadow={innerShadow} style={tw`flex items-center p-4 bg-primary-background-dark`}>
        <View style={tw`flex-row`}>
          <Input
            {...{
              label: 'amount',
              placeholder: 'amount',
              value: value.toString(),
              onChange: change,
              keyboardType: 'numeric',
            }}
          />
        </View>
      </Shadow>
      <View style={tw`mt-10`}>
        <Text>Min: {min}</Text>
        <Text>max {max}</Text>
        <Text>Current {value}</Text>
      </View>
    </View>
  )
}
