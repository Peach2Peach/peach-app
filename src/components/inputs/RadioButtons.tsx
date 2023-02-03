import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'

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
      tw`flex-row items-center justify-between w-full px-4 py-2 border-2 bg-primary-background-dark rounded-xl`,
      disabled && tw`opacity-50`,
      selected ? tw`border-primary-main` : tw`border-transparent`,
    ]}
  >
    {typeof display === 'string' ? (
      <Text style={tw`flex-1 subtitle-1`}>{display}</Text>
    ) : (
      <View style={tw`flex-1`}>{display}</View>
    )}
    <Icon
      id={disabled ? 'minusCircle' : selected ? 'radioSelected' : 'circle'}
      style={tw`w-5 h-5`}
      color={(selected ? tw`text-primary-main` : tw`text-black-3`).color}
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
          <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
        </Pressable>
      </View>
    ))}
  </View>
)

export default RadioButtons
