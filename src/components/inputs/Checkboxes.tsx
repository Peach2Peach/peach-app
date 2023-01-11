import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from '../'
import tw from '../../styles/tailwind'

export type CheckboxItemType = {
  value: string | number
  disabled?: boolean
  display: ReactNode
}

type CheckboxItemProps = ComponentProps & {
  onPress: () => void
  item: CheckboxItemType
  checked: boolean
  editing: boolean
}
export const CheckboxItem = ({ item, checked, onPress, style, testID, editing }: CheckboxItemProps): ReactElement => (
  <Pressable
    testID={testID}
    onPress={onPress}
    style={[
      tw`flex-row items-center justify-between w-full px-3 py-2 border-2 bg-primary-background-dark rounded-xl`,
      checked && !item.disabled && !editing ? tw`border-primary-main` : tw`border-transparent`,
      style,
    ]}
  >
    {item.display}
    {!item.disabled ? (
      <View style={tw`flex items-center justify-center w-5 h-5 ml-4`}>
        {editing ? (
          <Icon id={'edit'} color={tw`text-primary-main`.color} />
        ) : checked ? (
          <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
        ) : (
          <View style={tw`w-4 h-4 border-2 rounded-sm border-black-3`} />
        )}
      </View>
    ) : (
      <View style={tw`w-5 h-5 ml-4`} />
    )}
  </Pressable>
)

type CheckboxesProps = ComponentProps & {
  items: CheckboxItemType[]
  selectedValues?: (string | number)[]
  onChange?: (values: (string | number)[]) => void
  editing: boolean
}

/**
 * @description Component to display checkboxes
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
export const Checkboxes = ({
  items,
  selectedValues = [],
  onChange,
  style,
  testID,
  editing,
}: CheckboxesProps): ReactElement => {
  const select = (value: string | number) => {
    let newValues = Array.from(selectedValues)
    if (newValues.includes(value)) {
      newValues = newValues.filter((v) => v !== value)
    } else {
      newValues.push(value)
    }

    if (onChange) onChange(newValues)
  }

  const isSelected = (itm: CheckboxItemType) => selectedValues.includes(itm.value)

  return (
    <View testID={`checkboxes-${testID}`} style={style}>
      {items.map((item, i) => (
        <CheckboxItem
          style={i > 0 ? tw`mt-2` : {}}
          testID={`${testID}-checkbox-${item.value}`}
          onPress={() => select(item.value)}
          key={i}
          item={item}
          editing={editing}
          checked={isSelected(item)}
        />
      ))}
    </View>
  )
}

export default Checkboxes
