import { useNavigation } from '@react-navigation/native'
import { ColorValue, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { BitcoinPriceStats, HorizontalLine, Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import { getHeaderStyles } from '../../utils/layout'

const themes = {
  default: {
    text: tw`text-black-1`,
    backButton: tw`text-black-2`,
    bg: tw`bg-primary-background`,
  },
  inverted: {
    text: tw`text-primary-background-light`,
    backButton: tw`text-primary-mild-1`,
    bg: tw`bg-transparent`,
  },
}

export type HeaderIcon = {
  id: IconType
  accessibilityHint?: string
  color?: ColorValue | undefined
  onPress: () => void
}

export type HeaderConfig = {
  title?: string
  titleComponent?: JSX.Element
  icons?: HeaderIcon[]
  hideGoBackButton?: boolean
  theme?: 'default' | 'inverted'
  showPriceStats?: boolean
}

/** @deprecated */
export const OldHeader = ({ title, icons, titleComponent, hideGoBackButton, showPriceStats, theme }: HeaderConfig) => {
  const colors = themes[theme || 'default']
  const { goBack, canGoBack } = useNavigation()
  const { iconSize, fontSize } = getHeaderStyles()

  const shouldShowBackButton = !hideGoBackButton && canGoBack()

  return (
    <SafeAreaView>
      <View
        style={[
          tw`items-center py-1 px-sm gap-6px`,
          tw.md`px-md`,
          shouldShowBackButton && [tw`pl-3`, tw.md`pl-22px`],
          colors.bg,
        ]}
      >
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`flex-row items-center justify-start flex-shrink w-full gap-1`}>
            {shouldShowBackButton && (
              <TouchableOpacity onPress={goBack}>
                <Icon id="chevronLeft" style={iconSize} color={colors.backButton.color} />
              </TouchableOpacity>
            )}
            {title ? (
              <Text style={[...fontSize, colors.text, tw`flex-shrink`]} numberOfLines={1}>
                {title}
              </Text>
            ) : (
              titleComponent
            )}
          </View>

          <View style={tw`flex-row items-center justify-end gap-10px`}>
            {icons?.map(({ id, accessibilityHint, color, onPress }, i) => (
              <TouchableOpacity key={`${i}-${id}`} style={tw`p-2px`} {...{ accessibilityHint, onPress }}>
                <Icon {...{ id, color }} style={iconSize} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {showPriceStats && (
          <>
            <HorizontalLine />
            <BitcoinPriceStats />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

export const Header = ({ title, icons, titleComponent, hideGoBackButton, showPriceStats, theme }: HeaderConfig) => {
  const colors = themes[theme || 'default']
  const { goBack, canGoBack } = useNavigation()
  const { iconSize, fontSize } = getHeaderStyles()

  const shouldShowBackButton = !hideGoBackButton && canGoBack()

  return (
    <SafeAreaView>
      <View
        style={[
          tw`items-center py-1 px-sm gap-6px`,
          tw.md`px-md`,
          shouldShowBackButton && [tw`-ml-1`, tw.md`-ml-[10px]`],
        ]}
      >
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`flex-row items-center justify-start flex-shrink w-full gap-1`}>
            {shouldShowBackButton && (
              <TouchableOpacity onPress={goBack}>
                <Icon id="chevronLeft" style={iconSize} color={colors.backButton.color} />
              </TouchableOpacity>
            )}
            {title ? (
              <Text style={[...fontSize, colors.text, tw`flex-shrink`]} numberOfLines={1}>
                {title}
              </Text>
            ) : (
              titleComponent
            )}
          </View>

          <View style={tw`flex-row items-center justify-end gap-10px`}>
            {icons?.map(({ id, accessibilityHint, color, onPress }, i) => (
              <TouchableOpacity key={`${i}-${id}`} style={tw`p-2px`} {...{ accessibilityHint, onPress }}>
                <Icon {...{ id, color }} style={iconSize} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {showPriceStats && (
          <>
            <HorizontalLine />
            <BitcoinPriceStats />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}
