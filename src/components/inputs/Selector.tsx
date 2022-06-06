import React, { ReactElement, ReactNode, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '..'
import PeachScrollView from '../PeachScrollView'
const { LinearGradient } = require('react-native-gradients')
import { whiteGradient } from '../../utils/layout'
import { Fade } from '../animation'

interface Item {
  value: string,
  display: ReactNode
}

type SelectorProps = ComponentProps & {
  items: Item[],
  selectedValue?: string,
  onChange?: (value: (string)) => void,
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
export const Selector = ({ items, selectedValue, onChange, style }: SelectorProps): ReactElement => {
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    setIsAtStart(contentOffset.x <= 0)
    setIsAtEnd(contentOffset.x + layoutMeasurement.width >= contentSize.width)
  }
  return <View style={[tw`w-full flex-col items-center h-6`, style]}>
    <Fade show={!isAtStart} duration={200} style={tw`absolute left-0 h-full w-8 z-10`} pointerEvents="none">
      <LinearGradient colorList={whiteGradient} angle={0}/>
    </Fade>
    <PeachScrollView horizontal={true} showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      disable={items.length === 1}
      scrollEventThrottle={128}
      style={tw`max-w-full`}
    >
      <View style={tw`flex-row flex-nowrap`}>
        {items.map((item, i) => <Pressable
          onPress={() => onChange ? onChange(item.value) : null}
          key={item.value}
          style={[
            tw`px-3 h-6 flex justify-center border border-grey-2 rounded-lg`,
            item.value === selectedValue ? tw`border-peach-1 bg-peach-1` : {},
            i > 0 ? tw`ml-2` : {}
          ]}>
          <Text style={[
            tw`font-baloo text-xs leading-6 `,
            item.value === selectedValue ? tw`text-white-1` : tw`text-grey-2`
          ]}>
            {item.display}
          </Text>
        </Pressable>
        )}
      </View>
    </PeachScrollView>
    <Fade show={!isAtEnd} duration={200} style={tw`absolute right-0 h-full w-8 z-10`} pointerEvents="none">
      <LinearGradient colorList={whiteGradient} angle={180} />
    </Fade>
  </View>
}

export default Selector