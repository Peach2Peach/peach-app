import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'
import PeachScrollView from '../PeachScrollView'

interface Item {
  value: string
  display: ReactNode
}

type SelectorProps = ComponentProps & {
  items: Item[]
  selectedValue?: string
  onChange?: (value: string) => void
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
export const SelectorBig = ({ items, selectedValue, onChange, style }: SelectorProps): ReactElement => (
  <View style={[tw`flex-col items-center w-full h-8`, style]}>
    <PeachScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      disable={items.length === 1}
      scrollEventThrottle={128}
      style={tw`max-w-full`}>
      <View style={tw`flex-row flex-nowrap`}>
        {items.map((item, i) => (
          <Pressable
            onPress={() => (onChange ? onChange(item.value) : null)}
            key={item.value}
            style={[
              tw`flex justify-center h-8 px-4 border rounded border-grey-3`,
              item.value === selectedValue ? tw`border-peach-1 bg-peach-1` : {},
              i > 0 ? tw`ml-2` : {},
            ]}>
            <Text
              style={[
                tw`text-xs leading-6 font-baloo `,
                item.value === selectedValue ? tw`text-white-1` : tw`text-grey-3`,
              ]}>
              {item.display}
            </Text>
          </Pressable>
        ))}
      </View>
    </PeachScrollView>
  </View>
)

export default SelectorBig
