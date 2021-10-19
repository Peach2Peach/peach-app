import React, { ReactElement } from 'react'

interface Item {
  value: string,
  text: string
}
interface SelectProps {
  items: Item[],
  selectedValue: string,
  sort?: boolean,
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param props.onChange method to set locale on value change
 * @param props.sort if true, sort alphabetically and numerically
 */
export const Select = ({ items, selectedValue, onChange, sort }: SelectProps): ReactElement =>
  <select onChange={onChange}>
    {items
      .sort((a, b) => sort ? a.text > b.text ? 1 : -1 : 0)
      .map(item =>
        <option value={item.value} selected={item.value === selectedValue} key={item.value}>
          {item.text}
        </option>
      )
    }
  </select>

export default Select