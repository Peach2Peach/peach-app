import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Shadow, Text, Icon } from '..'
import tw from '../../styles/tailwind'
import { mildShadow } from '../../utils/layout'

type Item = {
  value: string|number|boolean
  data?: any
  disabled?: boolean
  display: ReactNode
}

type RadioButtonItemProp = ComponentProps & {
  display: ReactNode
  selected: boolean
  disabled?: boolean
}
const RadioButtonItem = ({ display, selected, disabled }: RadioButtonItemProp): ReactElement =>
  <View style={[
    tw`w-full flex-row justify-between items-center px-4 py-3 bg-peach-milder rounded-lg border-2`,
    selected ? tw`border-peach-1` : tw`border-transparent`
  ]}>
    <Text style={tw`font-baloo text-base`}>
      {display}
    </Text>
    <Icon id={disabled ? 'radioDisabled' : selected ? 'radioChecked' : 'radioUnchecked'}
      style={tw`h-5 w-5`}
      color={(selected ? tw`text-peach-1` : tw`text-grey-1`).color as string}/>
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
            <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
          </Shadow>
          : <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
        }
      </Pressable>
    </View>
    )}
  </View>

export default RadioButtons