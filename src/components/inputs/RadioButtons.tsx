import { ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
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
  onButtonPress: (value: T) => void
}

export const RadioButtons = <T, >({ items, selectedValue, onButtonPress, style }: Props<T>) => (
  <View style={[tw`gap-2`, style]}>
    {items.map((item, i) => (
      <TouchableOpacity key={i} style={tw`w-full`} disabled={item.disabled} onPress={() => onButtonPress(item.value)}>
        <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
      </TouchableOpacity>
    ))}
  </View>
)
