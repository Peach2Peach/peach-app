import React, { ReactElement } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../'
import { themes } from './TabbedNavigation'

export type TabbedNavigationItem<T> = {
  id: T
  display: string
  view?: (props: any) => ReactElement
}
export type TabbedNavigationProps<T> = ComponentProps & {
  items: TabbedNavigationItem<T>[]
  selected: TabbedNavigationItem<T>
  select: (item: TabbedNavigationItem<T>) => void
  buttonStyle?: ViewStyle
  theme?: 'default' | 'inverted'
}

export const NewTabbedNavigation = <T extends string>({
  items,
  selected,
  select,
  theme = 'default',
  style,
  buttonStyle,
}: TabbedNavigationProps<T>) => {
  const colors = themes[theme]
  return (
    <View style={[tw`flex-row justify-center`, style]}>
      {items.map((item) => (
        <Pressable
          style={[tw`mx-1`, buttonStyle, item.id === selected.id && tw`border-b-2 border-black-1`]}
          key={item.id}
          onPress={() => select(item)}
        >
          <Text style={[tw`mx-3 my-1 button-large`, item.id === selected.id ? colors.textSelected : colors.text]}>
            {item.display}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
