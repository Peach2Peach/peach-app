import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { mildShadow } from '../../utils/layout'
import { Shadow } from '..'

interface Item {
  value: string|number,
  disabled?: boolean,
  display: ReactNode
}

type CheckboxesProps = ComponentProps & {
  items: Item[],
  selectedValues?: (string|number)[],
  onChange?: (values: (string|number)[]) => void,
}

/**
 * @description Component to display checkboxes
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValues] selected values
 * @param [props.onChange] on change handler
 * @param [props.style] css style object
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
export const Checkboxes = ({ items, selectedValues = [], onChange, style }: CheckboxesProps): ReactElement => {
  const select = (value: string | number) => {
    let newValues = Array.from(selectedValues)
    if (newValues.indexOf(value) !== -1) {
      newValues = newValues.filter(v => v !== value)
    } else {
      newValues.push(value)
    }

    if (onChange) onChange(newValues)
  }

  const isSelected = (item: Item) => selectedValues.indexOf(item.value) !== -1

  return <View style={style}>
    <Shadow shadow={mildShadow}
      style={tw`w-full`}>
      <View>
        {items.map((item, i) => <View key={i} style={[
          tw`bg-white-1 rounded`,
          i > 0 ? tw`mt-2` : {}
        ]}>
          <Pressable style={[
            tw`flex-row items-center p-3 h-12 border border-grey-4 rounded`,
            !isSelected(item) ? tw`opacity-50` : {},
            item.disabled ? tw`opacity-20` : {},
          ]}
          onPress={() => !item.disabled ? select(item.value) : () => {}}>
            {isSelected(item)
              ? <Icon id="checkbox" style={tw`w-5 h-5`} />
              : <View style={tw`w-5 h-5 flex justify-center items-center`}>
                <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-3`} />
              </View>
            }
            <View style={tw`mx-4`}>
              {item.display}
            </View>
          </Pressable>
        </View>
        )}
      </View>
    </Shadow>
  </View>
}

export default Checkboxes