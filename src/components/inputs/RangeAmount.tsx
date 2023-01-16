import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { innerShadow } from '../../utils/layout'
import Icon from '../Icon'
import { Text } from '../text'
import { Shadow } from '../ui'
import Input from './Input'

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

const SliderKnob = () => (
  <View style={tw`flex items-center justify-center w-5 py-2 rounded-full bg-primary-main`}>
    <Icon id="chevronsRight" style={tw`w-4 h-4`} color={tw`text-primary-background-light`.color} />
  </View>
)

/**
 * @description Component to display a range selection
 * @example
 * <RangeAmount
    min={100000}
    max={2500000}
    value={selectedRange}
    onChange={setSelectedRange}
 */
export const RangeAmount = ({ min, max, value, onChange }: RangeAmountProps): ReactElement => {
  const changeMin = (selectedMin: string) => onChange([Number(selectedMin), value[1]])
  const changeMax = (selectedMax: string) => onChange([value[0], Number(selectedMax)])

  return (
    <View>
      <Shadow shadow={innerShadow} style={tw`flex items-center p-4 bg-primary-background-dark`}>
        <View style={tw`flex-row`}>
          <Input
            {...{
              label: 'min',
              placeholder: 'min',
              value: value[0].toString(),
              onChange: changeMin,
              keyboardType: 'numeric',
            }}
          />
        </View>
        <View style={tw`flex-row`}>
          <Input
            {...{
              label: 'max',
              placeholder: 'max',
              value: value[1].toString(),
              onChange: changeMax,
              keyboardType: 'numeric',
            }}
          />
        </View>
      </Shadow>
    </View>
  )
}
