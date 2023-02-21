import React, { ReactElement } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../'
import { ChatMessages } from '../../views/yourTrades/components/ChatMessages'

export const themes = {
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
  view?: (props: any) => ReactElement
}
type TabbedNavigationProps = ComponentProps & {
  items: TabbedNavigationItem[]
  selected: TabbedNavigationItem
  select: (item: TabbedNavigationItem) => void
  buttonStyle?: ViewStyle
  theme?: 'default' | 'inverted'
  messages?: { buy: number; sell: number; history: number }
}

export const TabbedNavigation = ({
  items,
  selected,
  select,
  theme = 'default',
  style,
  messages,
  buttonStyle,
}: TabbedNavigationProps) => {
  const colors = themes[theme]
  return (
    <View style={[tw`flex flex-row justify-center`, style]}>
      {items.map((item) => (
        <>
          <Pressable style={[tw`px-2`, buttonStyle]} key={item.id} onPress={() => select(item)}>
            <View style={tw`flex-row items-center`}>
              <Text style={[tw`px-4 py-2 input-label`, item.id === selected.id ? colors.textSelected : colors.text]}>
                {item.display}
              </Text>
              {!!messages && messages[item.id as TradeTab] > 0 && (
                <ChatMessages
                  style={tw`mb-1 -mt-px w-18px h-18px`}
                  textStyle={tw`text-[10px] text-primary-background-light`}
                  iconColor={tw`text-primary-main`.color}
                  messages={messages[item.id as TradeTab]}
                />
              )}
            </View>
            {item.id === selected.id && <View style={[tw`w-full h-0.5 `, colors.underline]} />}
          </Pressable>
        </>
      ))}
    </View>
  )
}
