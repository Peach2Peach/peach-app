import React, { ReactElement, ReactNode } from 'react'
import { View, TouchableOpacity } from 'react-native'
import tw from '../../../../styles/tailwind'
import PeachScrollView from '../../../PeachScrollView'

type Item<T> = {
  value: T
  display: ReactNode
}
type SelectorProps<T> = ComponentProps & {
  items: Item<T>[]
  selectedValue?: T
  onChange: (value: T) => void
  disabled?: boolean
}

export const CustomSelector = <T, >({
  items,
  selectedValue,
  onChange,
  style,
  disabled = false,
}: SelectorProps<T>): ReactElement => (
    <View style={[tw`flex-col items-center w-full`, style]}>
      <PeachScrollView
        showsHorizontalScrollIndicator={false}
        disable={items.length === 1}
        scrollEventThrottle={128}
        style={tw`max-w-full`}
        horizontal
      >
        <View style={tw`flex-row`}>
          {items.map(({ value, display }, i) => (
            <TouchableOpacity
              onPress={() => onChange(value)}
              disabled={disabled}
              key={'selector-item-' + value + '-' + i}
              style={[
                tw`flex-row items-center px-2 border rounded-lg border-black-3`,
                value === selectedValue && tw`bg-primary-main border-primary-main`,
                i > 0 && tw`ml-1`,
              ]}
            >
              {display}
            </TouchableOpacity>
          ))}
        </View>
      </PeachScrollView>
    </View>
  )
