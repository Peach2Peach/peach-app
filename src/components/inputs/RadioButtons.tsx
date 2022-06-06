import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { mildShadow } from '../../utils/layout'
import { Shadow, Text } from '..'
import Button from '../Button'

interface Item {
  value: string|number|boolean,
  data?: any,
  display: ReactNode
}

type RadioButtonsProps = ComponentProps & {
  items: Item[],
  selectedValue?: string|number|boolean,
  onChange?: (value: (string|number|boolean)) => void,
  ctaLabel?: string,
  ctaAction?: Function
}

/**
 * @description Component to display radio buttons
 * @param props Component properties
 * @param props.items the items in the dropdown
 * @param [props.selectedValue] selected value
 * @param [props.onChange] on change handler
 * @param [props.style] css style object
 * @example
 * <RadioButtons
    items={[
      {
        value: true,
        display: <Text>{i18n('yes')}</Text>
      },
      {
        value: false,
        display: <Text>{i18n('no')}</Text>
      }
    ]}
    selectedValue={kyc}
    onChange={(value) => setKYC(value as boolean)}/>
 */
export const RadioButtons = ({
  items,
  selectedValue,
  onChange,
  style,
  ctaLabel,
  ctaAction
}: RadioButtonsProps): ReactElement =>
  <View style={style}>
    <Shadow shadow={mildShadow} style={tw`w-full`}>
      <View>
        {items.map((item, i) => <View key={i} style={[
          tw`flex-row items-center`,
          i > 0 ? tw`mt-2` : {}
        ]}>
          <Pressable style={[
            tw`h-11 flex-grow flex-row items-center p-3 border border-grey-4 bg-white-1 rounded`,
            item.value !== selectedValue ? tw`opacity-50` : {}
          ]}
          onPress={() => onChange ? onChange(item.value) : null}>
            <View style={tw`w-4 h-4 rounded-full border-2 border-grey-3 flex justify-center items-center`}>
              {item.value === selectedValue
                ? <Icon id="circle" style={tw`w-2 h-2`} />
                : null
              }
            </View>
            <Text style={tw`ml-4`}>
              {item.display}
            </Text>
          </Pressable>
          {ctaAction && ctaLabel
            ? <Button
              key={i}
              wide={false}
              style={tw`w-16 h-10 ml-2 flex-shrink`}
              onPress={() => ctaAction(item.data)}
              title={ctaLabel}
            />
            : null
          }
        </View>
        )}
      </View>
    </Shadow>
  </View>

export default RadioButtons