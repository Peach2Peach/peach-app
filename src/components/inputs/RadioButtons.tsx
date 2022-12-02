import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Shadow, Text, Icon } from '..'
import tw from '../../styles/tailwind'
import { mildShadow } from '../../utils/layout'

export type RadioButtonItem<T> = {
  value: T
  display: ReactNode
  disabled?: boolean
  data?: any
}

type RadioButtonItemProp = ComponentProps & {
  display: ReactNode
  selected: boolean
  disabled?: boolean
}
const RadioButtonItem = ({ display, selected, disabled }: RadioButtonItemProp): ReactElement => (
  <View
    style={[
      tw`w-full flex-row justify-between items-center px-4 py-3 bg-peach-milder rounded-lg border-2`,
      selected ? tw`border-peach-1` : tw`border-transparent`,
    ]}
  >
    <Text style={tw`font-baloo text-base`}>{display}</Text>
    <Icon
      id={disabled ? 'minusCircle' : selected ? 'radioSelected' : 'circle'}
      style={tw`h-5 w-5`}
      color={(selected ? tw`text-peach-1` : tw`text-grey-1`).color}
    />
  </View>
)

type RadioButtonsProps<T> = ComponentProps & {
  items: RadioButtonItem<T>[]
  selectedValue?: T
  onChange?: (value: T) => void
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
export const RadioButtons = <T, >({ items, selectedValue, onChange, style }: RadioButtonsProps<T>): ReactElement => (
  <View style={style}>
    {items.map((item, i) => (
      <View key={i} style={[tw`flex-row items-center`, i > 0 ? tw`mt-2` : {}]}>
        <Pressable style={tw`w-full`} onPress={() => (onChange && !item.disabled ? onChange(item.value) : null)}>
          {item.value === selectedValue ? (
            <Shadow shadow={mildShadow}>
              <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
            </Shadow>
          ) : (
            <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
          )}
        </Pressable>
      </View>
    ))}
  </View>
)

export default RadioButtons
