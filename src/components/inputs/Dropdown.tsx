import React, { ReactElement, ReactNode, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Shadow } from 'react-native-neomorph-shadows'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

interface Item {
  value: string|number,
  display: (isOpen: boolean) => ReactNode
}

interface DropdownProps {
  items: Item[],
  width?: number,
  selectedValue?: string|number,
  onChange?: (value: string|number) => void
}

const shadowStyle = {
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: 0.25,
  shadowColor: '#000000',
  shadowRadius: 4,
  backgroundColor: 'transparent'
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param [props.width] dropdown width
 * @param props.onChange method to set locale on value change
 * @example
 * <Dropdown
 *   selectedValue={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 *   width={tw`w-72`.width as number}
 *   items={[
 *     {
 *       value: 500000,
 *       display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
 *         <View style={tw`flex-row justify-start items-center`}>
 *           <Text style={tw`font-mono text-grey-2`}>0.00</Text><Text style={tw`font-mono`}> 500 000 Sat</Text>
 *         </View>
 *         {isOpen
 *           ? <Text style={tw`font-mono text-peach-1`}>€50</Text>
 *           : null
 *         }
 *       </View>
 *     },
 *     {
 *       value: 1000000,
 *       display: (isOpen: boolean) => <View>
 *         <Text>0.01 000 000 Sat</Text>
 *         {isOpen
 *           ? <Text>€100</Text>
 *           : null
 *         }
 *       </View>
 *     }
 *   ]}
 * />
 */
export const Dropdown = ({ items, selectedValue, width = 273, onChange }: DropdownProps): ReactElement => {
  const [isOpen, setOpen] = useState(false)
  const height = tw`h-10`.height as number * (isOpen ? items.length : 1)
  const selectedItem = items.find(item => item.value === selectedValue)
  const select = (item: Item) => {
    if (onChange) onChange(item.value)
    setOpen(!isOpen)
  }

  return <View style={[
    tw`flex items-center border border-grey-4 rounded z-10`,
    { width, height }
  ]}>
    <Shadow
      inner={!isOpen}
      style={{
        ...shadowStyle,
        ...tw`w-full rounded`,
        width, height
      }}
    >
      <View style={[
        tw`py-0 pl-4 pr-3`,
        isOpen ? tw`bg-white-1` : {}
      ]}>
        {isOpen
          ? [
            <Pressable key={selectedItem?.value} style={tw`h-10 flex justify-center opacity-30`}
              onPress={() => setOpen(!isOpen)}>
              {selectedItem?.display(false)}
            </Pressable>,
            items
              .filter(item => item.value !== selectedValue)
              .map(item => <Pressable
                key={item.value}
                style={tw`h-10 flex justify-center`}
                onPress={() => select(item)}>
                {item.display(isOpen)}
              </Pressable>
              )
          ]
          : <Pressable style={tw`h-10 flex justify-center`} onPress={() => setOpen(!isOpen)}>
            {items.find(item => item.value === selectedValue)?.display(isOpen)}
          </Pressable>
        }
      </View>
    </Shadow>
    <Icon id={isOpen ? 'dropdownOpen' : 'dropdownClosed'} style={tw`w-6 h-10 absolute right-2`} />
  </View>
}

export default Dropdown