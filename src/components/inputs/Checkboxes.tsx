import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text, Icon } from '../'
import { mildShadow } from '../../utils/layout'
import { Shadow } from '..'

export type CheckboxItemType = {
  value: string | number
  disabled?: boolean
  display: ReactNode
}

type CheckboxItemProps = ComponentProps & {
  onPress: () => void
  item: CheckboxItemType
  checked: boolean
}
export const CheckboxItem = ({ item, checked, onPress, style, testID }: CheckboxItemProps): ReactElement => {
  const content = (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[
        tw`w-full flex-row justify-between items-center px-4 py-3 bg-peach-milder rounded-lg border-2`,
        checked && !item.disabled ? tw`border-peach-1` : tw`border-transparent`,
        style,
      ]}
    >
      <Text style={tw`font-baloo text-base`}>{item.display}</Text>
      {!item.disabled ? (
        <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
          {checked ? (
            <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-peach-1`.color} />
          ) : (
            <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-2`} />
          )}
        </View>
      ) : (
        <View style={tw`w-5 h-5 ml-4`} />
      )}
    </Pressable>
  )

  return checked ? <Shadow shadow={mildShadow}>{content}</Shadow> : content
}

type CheckboxesProps = ComponentProps & {
  items: CheckboxItemType[]
  selectedValues?: (string | number)[]
  onChange?: (values: (string | number)[]) => void
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
export const Checkboxes = ({ items, selectedValues = [], onChange, style, testID }: CheckboxesProps): ReactElement => {
  const select = (value: string | number) => {
    let newValues = Array.from(selectedValues)
    if (newValues.indexOf(value) !== -1) {
      newValues = newValues.filter((v) => v !== value)
    } else {
      newValues.push(value)
    }

    if (onChange) onChange(newValues)
  }

  const isSelected = (itm: CheckboxItemType) => selectedValues.indexOf(itm.value) !== -1

  return (
    <View testID={`checkboxes-${testID}`} style={style}>
      {items.map((item, i) => (
        <CheckboxItem
          style={i > 0 ? tw`mt-2` : {}}
          testID={`${testID}-checkbox-${item.value}`}
          onPress={() => select(item.value)}
          key={i}
          item={item}
          checked={isSelected(item)}
        />
      ))}
    </View>
  )
}

export default Checkboxes
