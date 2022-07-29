import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { mildShadow } from '../../utils/layout'
import { Shadow, Text } from '..'
import Button from '../Button'

type Item =  {
  value: string|number|boolean,
  data?: any,
  display: ReactNode
}


type RadioButtonItemProp = ComponentProps & {
  display: ReactNode,
  selected: boolean
}
const RadioButtonItem = ({ display, selected }: RadioButtonItemProp): ReactElement =>
  <View style={[
    tw`w-full flex-row justify-between items-center px-4 py-3 bg-peach-milder rounded-lg border-2`,
    selected ? tw`border-peach-1` : tw`border-transparent`
  ]}>
    <Text style={tw`font-baloo text-base`}>
      {display}
    </Text>
    {selected
      ? <View style={tw`p-.5 rounded-full border-2 border-peach-1 flex justify-center items-center`}>
        <View style={[tw`bg-peach-1 rounded-full`, { width: 10, height: 10 }]} />
      </View>
      : <View style={tw`p-.5 rounded-full border-2 border-grey-2`}>
        <View style={{ width: 10, height: 10 }} />
      </View>
    }
  </View>

type RadioButtonsProps = ComponentProps & {
  items: Item[],
  selectedValue?: string|number|boolean,
  onChange?: (value: (string|number|boolean)) => void,
}

/**
 * @description Component to display radio buttons
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param [props.onChange] on change handler
 * @param [props.style] css style object
 * @example
 * <RadioButtons
    items={[
      {
        value: true,
        display: <Text>{i18n('yes')}</Text>
      },
      {
        value: false,
        display: <Text>{i18n('no')}</Text>
      }
    ]}
    selectedValue={kyc}
    onChange={(value) => setKYC(value as boolean)}/>
 */
export const RadioButtons = ({
  items,
  selectedValue,
  onChange,
  style,
}: RadioButtonsProps): ReactElement =>
  <View style={style}>
    {items.map((item, i) => <View key={i} style={[
      tw`flex-row items-center`,
      i > 0 ? tw`mt-2` : {}
    ]}>
      <Pressable style={tw`w-full`} onPress={() => onChange ? onChange(item.value) : null}>
        {item.value === selectedValue
          ? <Shadow shadow={mildShadow}>
            <RadioButtonItem display={item.display} selected={item.value === selectedValue} />
          </Shadow>
          : <RadioButtonItem display={item.display} selected={item.value === selectedValue} />
        }
      </Pressable>
    </View>
    )}
  </View>

export default RadioButtons