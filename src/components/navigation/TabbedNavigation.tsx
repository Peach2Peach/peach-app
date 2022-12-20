import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../'

const themes = {
  default: {
    text: tw`text-black-2`,
    textSelected: tw`text-black-1`,
    underline: tw`bg-black-1`,
  },
  inverted: {
    text: tw`text-primary-mild-1`,
    textSelected: tw`text-primary-background-light`,
    underline: tw`bg-primary-background-light`,
  },
}

export type TabbedNavigationItem = {
  id: string
  display: string
  view: (props: ComponentProps) => ReactElement
}
type TabbedNavigationProps = ComponentProps & {
  items: TabbedNavigationItem[]
  selected: TabbedNavigationItem
  select: (item: TabbedNavigationItem) => void
  theme: 'default' | 'inverted'
}

export const TabbedNavigation = ({ items, selected, select, theme = 'default', style }: TabbedNavigationProps) => {
  const colors = themes[theme]
  return (
    <View style={[tw`flex flex-row justify-center`, style]}>
      {items.map((item) => (
        <Pressable style={tw`px-2`} key={item.id} onPress={() => select(item)}>
          <Text style={[tw`input-label px-4 py-2`, item.id === selected.id ? colors.textSelected : colors.text]}>
            {item.display}
          </Text>
          {item.id === selected.id && <View style={[tw`w-full h-0.5 `, colors.underline]} />}
        </Pressable>
      ))}
    </View>
  )
}
