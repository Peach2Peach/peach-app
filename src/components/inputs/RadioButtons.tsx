import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Shadow } from 'react-native-shadow-2'
import { Text } from '..'

const shadowProps = {
  distance: 16,
  startColor: '#0000000D',
  finalColor: '#0000',
  offset: [0, 6] as [x: string | number, y: string | number],
  radius: 0
}

interface Item {
  value: string|number|boolean,
  display: ReactNode
}

interface RadioButtonsProps {
  items: Item[],
  selectedValue?: string|number|boolean,
  onChange?: (value: (string|number|boolean)) => void
}

/**
 * @description Component to display radio buttons
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param [props.onChange] on change handler
 * @example
 */
export const RadioButtons = ({ items, selectedValue, onChange }: RadioButtonsProps): ReactElement => <View>
  {items.map((item, i) =>
    <Shadow {...shadowProps} viewStyle={[
      tw`w-full`,
      item.value !== selectedValue ? tw`opacity-50` : {},
      i > 0 ? tw`mt-2` : {}
    ]}>
      <Pressable key={String(item.value)}
        style={tw`flex-row items-center p-3 bg-white-1 rounded`}
        onPress={() => onChange ? onChange(item.value) : null}>
        <View style={tw`w-5 h-5 rounded-full border-2 border-grey-3 flex justify-center items-center`}>
          {item.value === selectedValue
            ? <Icon id="circle" style={tw`w-3 h-3`} />
            : null
          }
        </View>
        <View style={tw`ml-4`}>
          {item.display}
        </View>
      </Pressable>
    </Shadow>
  )}
</View>

export default RadioButtons