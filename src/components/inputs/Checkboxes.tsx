import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Shadow } from 'react-native-shadow-2'
import { Text } from '..'
import { mildShadow } from '../../utils/layoutUtils'

interface Item {
  value: string|number,
  display: ReactNode
}

interface CheckboxesProps {
  items: Item[],
  selectedValues?: (string|number)[],
  onChange?: (values: (string|number)[]) => void
}

/**
 * @description Component to display checkboxes
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValues] selected values
 * @param [props.onChange] on change handler
 * @example
 * <Checkboxes
    items={currencies.map(value => ({
      value,
      display: [
        <Text>{i18n(`currency.${value}`)} </Text>,
        <Text style={tw`text-grey-1`}>({value})</Text>
      ]
    }))}
    selectedValues={selectedCurrencies}
    onChange={(values) => setSelectedCurrencies(values)}/>
 */
export const Checkboxes = ({ items, selectedValues = [], onChange }: CheckboxesProps): ReactElement => {
  const select = (value: string | number) => {
    let newValues = selectedValues.map(v => v)
    if (newValues.indexOf(value) !== -1) {
      newValues = newValues.filter(v => v !== value)
    } else {
      newValues.push(value)
    }
    if (onChange) onChange(newValues)
  }

  const isSelected = (item: Item) => selectedValues.indexOf(item.value) !== -1

  return <View>
    {items.map((item, i) =>
      <Shadow {...mildShadow}
        key={String(item.value)}
        viewStyle={[
          tw`w-full`,
          !isSelected(item) ? tw`opacity-50` : {},
          i > 0 ? tw`mt-2` : {}
        ]}>
        <Pressable style={tw`flex-row items-center p-3 bg-white-1 border border-grey-4 rounded`}
          onPress={() => select(item.value)}>
          {isSelected(item)
            ? <Icon id="check" style={tw`w-5 h-5`}/>
            : <View style={tw`w-5 h-5 flex justify-center items-center`}>
              <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-3`} />
            </View>
          }
          <Text style={tw`ml-4`}>
            {item.display}
          </Text>
        </Pressable>
      </Shadow>
    )}
  </View>
}

export default Checkboxes