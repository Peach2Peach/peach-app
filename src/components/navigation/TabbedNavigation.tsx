import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Icon, Text } from '../'

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
  view?: (props: any) => ReactElement
}
type TabbedNavigationProps = ComponentProps & {
  items: TabbedNavigationItem[]
  selected: TabbedNavigationItem
  select: (item: TabbedNavigationItem) => void
  theme?: 'default' | 'inverted'
  messages: { buy: number; sell: number; history: number }
}

export const TabbedNavigation = ({
  items,
  selected,
  select,
  theme = 'default',
  style,
  messages,
}: TabbedNavigationProps) => {
  const colors = themes[theme]
  return (
    <View style={[tw`flex flex-row justify-center`, style]}>
      {items.map((item) => (
        <>
          <Pressable style={tw`px-2`} key={item.id} onPress={() => select(item)}>
            <View style={tw`flex-row items-center`}>
              <Text style={[tw`px-2 my-2 input-label`, item.id === selected.id ? colors.textSelected : colors.text]}>
                {item.display}
              </Text>
              {messages[item.id as 'buy' | 'sell' | 'history'] > 0 && (
                <View style={tw`justify-center mb-2 w-18px h-18px`}>
                  <Icon id={'messageFull'} color={tw`text-primary-main`.color} style={tw`w-18px h-18px`} />
                  <Text
                    style={[
                      tw`absolute w-full font-bold text-center pb-0.5 text-10px`,
                      tw`text-primary-background-light`,
                    ]}
                  >
                    {messages[item.id as 'buy' | 'sell' | 'history']}
                  </Text>
                </View>
              )}
            </View>
            {item.id === selected.id && <View style={[tw`w-full h-0.5 `, colors.underline]} />}
          </Pressable>
        </>
      ))}
    </View>
  )
}

// messages[item.id as 'buy' | 'sell' | 'past']
