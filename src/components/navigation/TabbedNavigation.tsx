import { Pressable, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { PulsingText } from '../matches/components/PulsingText'
import { PeachText } from '../text/PeachText'

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

export type TabbedNavigationItem<T> = {
  id: T
  display: string
  view?: (props: any) => JSX.Element
}
type TabbedNavigationProps<T extends string> = ComponentProps & {
  items: TabbedNavigationItem<T>[]
  selected: TabbedNavigationItem<T>
  select: (item: TabbedNavigationItem<T>) => void
  buttonStyle?: ViewStyle
  theme?: 'default' | 'inverted'
  tabHasError?: string[]
}

export const TabbedNavigation = <T extends string>({
  items,
  selected,
  select,
  theme = 'default',
  style,
  buttonStyle,
  tabHasError = [],
}: TabbedNavigationProps<T>) => {
  const colors = themes[theme]
  return (
    <View style={[tw`flex-row justify-center`, style]}>
      {items.map((item) => (
        <Pressable
          style={[
            tw`shrink px-2`,
            buttonStyle,
            !!tabHasError.length && !tabHasError.includes(item.id) && tw`opacity-10`,
          ]}
          key={item.id}
          onPress={() => select(item)}
        >
          <View style={tw`flex-row items-center`}>
            {tabHasError.includes(item.id) && item.id !== selected.id ? (
              <PulsingText showPulse style={[tw`px-4 py-2 text-center input-label`]}>
                {item.display}
              </PulsingText>
            ) : (
              <PeachText
                style={[
                  tw`px-4 py-2 text-center input-label`,
                  item.id === selected.id ? colors.textSelected : colors.text,
                  tabHasError.includes(item.id) && item.id !== selected.id && tw`text-error-main`,
                ]}
              >
                {item.display}
              </PeachText>
            )}
          </View>
          {item.id === selected.id && <View style={[tw`w-full h-0.5 `, colors.underline]} />}
        </Pressable>
      ))}
    </View>
  )
}
