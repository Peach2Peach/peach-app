import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { mildShadow } from '../../utils/layout'
import { Shadow } from '..'

type Item = {
  value: string|number,
  disabled?: boolean,
  display: ReactNode,
}

type CheckboxItemProps = {
  item: Item,
  index: number,
  selectedValues: (string|number)[],
  select: (value: string | number) => void,
}
const CheckboxItem = ({ item, index, selectedValues, select }: CheckboxItemProps): ReactElement => {
  const isSelected = (itm: Item) => selectedValues.indexOf(itm.value) !== -1
  const selectItem = () => !item.disabled ? select(item.value) : () => {}

  return <View style={[
    tw`flex-row items-center`,
    index > 0 ? tw`mt-4` : {},
    !isSelected(item) ? tw`opacity-50` : {},
    item.disabled ? tw`opacity-20` : {},
  ]}>
    {!item.disabled
      ? <Pressable onPress={selectItem}>
        {isSelected(item)
          ? <Icon id="checkbox" style={tw`w-5 h-5`} color={tw`text-peach-1`.color as string} />
          : <View style={tw`w-5 h-5 flex justify-center items-center`}>
            <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-3`} />
          </View>
        }
      </Pressable>
      : <View style={tw`w-5 h-5`}/>
    }
    <Shadow shadow={mildShadow} style={tw`w-full`}>
      <View style={tw`bg-white-1 rounded mx-4 p-3`}>
        {item.display}
      </View>
    </Shadow>
  </View>
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

    newValues = newValues.filter(v => !items.find(item => item.value === v)!.invalid)

    if (onChange) onChange(newValues)
  }


  return <View style={style}>
    {items.map((item, i) => <CheckboxItem
      key={i} index={i}
      item={item}
      selectedValues={selectedValues}
      select={select}
    />
    )}
  </View>
}

export default Checkboxes