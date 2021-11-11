import React, { ReactElement, useState } from 'react'
import tw from '../../styles/tailwind'
import { Pressable, View } from 'react-native'
import Icon from '../Icon'
import { Text } from '..'

interface Item {
  value: string|number,
  display: string
}

interface SelectProps {
  items: Item[],
  selectedValue: string | number | null,
  label?: string,
  onChange?: (value: string|number) => void
}

export const Select = ({ items, selectedValue, label, onChange }: SelectProps): ReactElement => {
  const [isOpen, setOpen] = useState(false)
  const select = (item: Item) => {
    if (onChange) onChange(item.value)
    setOpen(!isOpen)
  }

  return <View>
    <Pressable style={tw`flex-row justify-end items-center mb-4`} onPress={() => setOpen(!isOpen)}>
      <Text style={tw`text-xs text-right leading-5 uppercase`}>
        {selectedValue && !isOpen
          ? items.find(item => item.value === selectedValue)?.display
          : label || items[0].display
        }
      </Text>
      <Icon id={isOpen ? 'selectClosed' : 'selectOpen'} style={tw`flex-shrink-0 ml-2 w-2 h-2`} />
    </Pressable>
    {isOpen
      ? items.map(item => <Pressable
        key={item.value}
        style={tw`flex justify-center mb-3`}
        onPress={() => select(item)}>
        <Text style={[
          tw`text-xs text-right leading-5 uppercase`,
          item.value === selectedValue ? tw`text-peach-1` : {}
        ]}>{item.display}</Text>
      </Pressable>
      )
      : null
    }
  </View>
}

export default Select