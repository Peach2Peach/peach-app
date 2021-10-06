import React, { ReactElement } from 'react'
import { Picker } from '@react-native-picker/picker'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'

interface Item {
  value: string,
  text: string
}
interface CustomEvent {
  currentTarget: {
    value: ItemValue
  }
}
interface SelectProps {
  items: Item[],
  selectedValue: ItemValue,
  sort?: boolean,
  onChange: (e: CustomEvent) => void
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param props.onChange method to set locale on value change
 * @param props.sort if true, sort alphabetically and numerically
 */
export default ({ items, selectedValue, onChange, sort }: SelectProps): ReactElement =>
  <Picker selectedValue={selectedValue} onValueChange={(value: ItemValue) => onChange({ currentTarget: { value } })}>
    {items
      .sort((a, b) => sort ? a.text > b.text ? 1 : -1 : 0)
      .map(item =>
        <Picker.Item value={item.value} label={item.text} key={item.value}/>
      )
    }
  </Picker>