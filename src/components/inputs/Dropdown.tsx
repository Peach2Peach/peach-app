import React, { ReactElement, ReactNode, useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Shadow } from '..'
import { innerShadow, mildShadow } from '../../utils/layout'
import PeachScrollView from '../PeachScrollView'
import { isAndroid } from '../../utils/system'
import { useFocusEffect } from '@react-navigation/native'
import { UserDataStore, useUserDataStore } from '../../store'
import { BUCKETS } from '../../constants'
import shallow from 'zustand/shallow'

interface Item {
  value: number
  display: (isOpen: boolean) => ReactNode
}

type DropdownProps = ComponentProps & {
  items: Item[]
}

const dropdownSelector = (state: UserDataStore) => ({
  amount: state.settings.amount && BUCKETS.includes(state.settings.amount) ? state.settings.amount : BUCKETS[0],
  setAmount: state.setAmount,
})

/**
 * @description Component to display the Sats select
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param props.onChange method to set locale on value change
 * @param [props.onToggle] callback function when dropdown opens or closes
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
export const Dropdown = ({ items, style, testID }: DropdownProps): ReactElement => {
  const { amount, setAmount } = useUserDataStore(dropdownSelector, shallow)
  const [isOpen, setOpen] = useState(false)
  const selectedItem = items.find((item) => item.value === amount)

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])
  const select = (value: number) => {
    setAmount(value)
    toggle()
  }

  useFocusEffect(useCallback(() => setOpen(false), []))

  return (
    <View style={[tw`w-full rounded bg-white-1`, !isOpen ? tw`overflow-hidden` : {}, style]}>
      <Shadow shadow={isOpen ? mildShadow : innerShadow}>
        <View style={[tw`w-full py-0 border border-grey-4 rounded`, isOpen ? tw`bg-white-1` : {}]}>
          {isOpen ? (
            [
              <Pressable
                testID={`${testID}-close`}
                key={selectedItem?.value}
                style={tw`h-10 pl-4 pr-3 flex justify-center opacity-30`}
                onPress={toggle}
              >
                {selectedItem?.display(false)}
              </Pressable>,
              <PeachScrollView
                key="scroll"
                style={[
                  tw`pl-4 pr-3`,
                  { height: (tw`h-10`.height as number) * (isAndroid() ? items.length : Math.min(5, items.length)) },
                ]}
              >
                {items.map(({ value, display }) => (
                  <Pressable
                    testID={`${testID}-item-${value}`}
                    key={value}
                    style={tw`h-10 flex justify-center`}
                    onPress={() => select(value)}
                  >
                    {display(isOpen)}
                  </Pressable>
                ))}
              </PeachScrollView>,
            ]
          ) : (
            <Pressable testID={`${testID}-open`} style={tw`h-10 pl-4 pr-3 flex justify-center`} onPress={toggle}>
              {selectedItem?.display(isOpen)}
            </Pressable>
          )}
        </View>
        <Pressable testID={`${testID}-toggle`} style={tw`absolute right-2`} onPress={toggle}>
          <Icon
            id={isOpen ? 'dropdownOpen' : 'dropdownClosed'}
            style={tw`w-6 h-10`}
            color={tw`text-peach-1`.color as string}
          />
        </Pressable>
      </Shadow>
    </View>
  )
}

export default Dropdown
