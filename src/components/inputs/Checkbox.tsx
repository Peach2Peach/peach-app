import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from '..'
import tw from '../../styles/tailwind'

export type CheckboxType = {
  value: string | number
  disabled?: boolean
  display: ReactNode
}

type CheckboxProps = ComponentProps & {
  onPress: () => void
  item: CheckboxType
  checked: boolean
  editing: boolean
}
export const Checkbox = ({ item, checked, onPress, style, testID, editing }: CheckboxProps): ReactElement => (
  <Pressable
    testID={testID}
    onPress={onPress}
    style={[
      tw`w-full flex-row justify-between items-center px-3 py-2 bg-primary-background-dark rounded-xl border-2`,
      checked && !item.disabled && !editing ? tw`border-primary-main` : tw`border-transparent`,
      style,
    ]}
  >
    {item.display}
    {!item.disabled ? (
      <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
        {editing ? (
          <Icon id={'edit'} color={tw`text-primary-main`.color} />
        ) : checked ? (
          <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
        ) : (
          <View style={tw`w-4 h-4 rounded-sm border-2 border-black-3`} />
        )}
      </View>
    ) : (
      <View style={tw`w-5 h-5 ml-4`} />
    )}
  </Pressable>
)
