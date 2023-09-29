import { ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
import tw from '../../../../styles/tailwind'

type Item<T> = {
  value: T
  display: ReactNode
}
type SelectorProps<T> = {
  items: Item<T>[]
  selectedValue?: T
  onChange: (value: T) => void
  disabled?: boolean
}

export const CustomSelector = <T, >({ items, selectedValue, onChange, disabled = false }: SelectorProps<T>) => (
  <View style={tw`flex-row flex-wrap justify-center gap-1`}>
    {items.map(({ value, display }, i) => (
      <TouchableOpacity
        onPress={() => onChange(value)}
        disabled={disabled}
        key={`selector-item-${value}-${i}`}
        style={[
          tw`flex-row items-center px-2 border rounded-lg border-black-3`,
          value === selectedValue && tw`bg-primary-main border-primary-main`,
        ]}
      >
        {display}
      </TouchableOpacity>
    ))}
  </View>
)
