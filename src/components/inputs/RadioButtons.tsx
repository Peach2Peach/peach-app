import { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { RadioButtonItem } from './RadioButtonItem'

export type RadioButtonItem<T> = {
  value: T
  display: ReactNode
  disabled?: boolean
  data?: any
}

type Props<T> = ComponentProps & {
  items: RadioButtonItem<T>[]
  selectedValue?: T
  onChange?: (value: T) => void
}

export const RadioButtons = <T, >({ items, selectedValue, onChange, style }: Props<T>) => (
  <View style={[tw`gap-2`, style]}>
    {items.map((item, i) => (
      <View key={i} style={tw`flex-row items-center`}>
        <Pressable style={tw`w-full`} onPress={() => (onChange && !item.disabled ? onChange(item.value) : null)}>
          <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
        </Pressable>
      </View>
    ))}
  </View>
)
