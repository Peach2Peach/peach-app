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
  placeholder?: string,
  onChange?: (value: string|number) => void
}

export const Select = ({ items, selectedValue, placeholder, onChange }: SelectProps): ReactElement => {
  const [isOpen, setOpen] = useState(false)
  const select = (item: Item) => {
    if (onChange) onChange(item.value)
    setOpen(!isOpen)
  }

  return <View style={tw`flex-row justify-end items-start`}>
    <View>
      {isOpen
        ? items.map(item => <Pressable
          key={item.value}
          style={tw`flex justify-center`}
          onPress={() => select(item)}>
          <Text style={[
            tw`text-xs text-right leading-5 uppercase`,
            item.value === selectedValue ? tw`font-bold` : {}
          ]}>{item.display}</Text>
        </Pressable>
        )
        : <Pressable style={tw`flex justify-center`} onPress={() => setOpen(!isOpen)}>
          <Text style={tw`text-xs text-right leading-5 uppercase`}>
            {selectedValue
              ? items.find(item => item.value === selectedValue)?.display
              : placeholder || items[0].display
            }
          </Text>
        </Pressable>
      }
    </View>
    <Pressable onPress={() => setOpen(!isOpen)}>
      <Icon id={isOpen ? 'selectOpen' : 'selectClosed'} style={tw`flex-shrink-0 ml-2 mt-1 w-2 h-3`} />
    </Pressable>
  </View>
}

export default Select