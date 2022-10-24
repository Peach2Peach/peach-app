import React, { ReactElement, ReactNode, useState } from 'react'
import { LayoutChangeEvent, Pressable, View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'
import PeachScrollView from '../PeachScrollView'

type Item<T> = {
  value: T
  display: ReactNode
}

type SelectorProps<T> = ComponentProps & {
  items: Item<T>[]
  selectedValue?: T
  onChange?: (value: T) => void
}

/**
 * @description Component to display radio buttons
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param [props.onChange] on change handler
 * @param [props.style] css style object
 * @example
 * <Selector
    items={[
      {
        value: 'EUR',
        display: <Text>{i18n('EUR')}</Text>
      },
      {
        value: 'USD',
        display: <Text>{i18n('USD')}</Text>
      }
    ]}
    selectedValue={currency}
    onChange={(value) => setCurrencu(value)}/>
 */
export const Selector = <T, >({ items, selectedValue, onChange, style }: SelectorProps<T>): ReactElement => (
  <View style={[tw`w-full flex-col items-center h-6`, style]}>
    <PeachScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      disable={items.length === 1}
      scrollEventThrottle={128}
      style={tw`max-w-full`}
    >
      <View style={tw`flex-row flex-nowrap`}>
        {items.map((item, i) => (
          <Pressable
            onPress={() => (onChange ? onChange(item.value) : null)}
            key={item.value as unknown as string}
            style={[
              tw`px-3 h-6 flex justify-center border border-grey-2 rounded-lg`,
              item.value === selectedValue ? tw`border-peach-1 bg-peach-1` : {},
              i > 0 ? tw`ml-2` : {},
            ]}
          >
            <Text
              style={[
                tw`font-baloo text-xs leading-6 `,
                item.value === selectedValue ? tw`text-white-1` : tw`text-grey-2`,
              ]}
            >
              {item.display}
            </Text>
          </Pressable>
        ))}
      </View>
    </PeachScrollView>
  </View>
)

export default Selector
