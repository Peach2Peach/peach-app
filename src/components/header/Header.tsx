import { useNavigation } from '@react-navigation/native'
import { ColorValue, SafeAreaView, TouchableOpacity, View, ViewProps } from 'react-native'
import shallow from 'zustand/shallow'
import { HorizontalLine, Icon, PriceFormat, Text } from '..'
import { IconType } from '../../assets/icons'
import { useBitcoinStore } from '../../store/bitcoinStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getHeaderStyles } from '../../utils/layout'
import { round } from '../../utils/math'
import { thousands } from '../../utils/string'
import { BTCAmount } from '../bitcoin'

const oldThemes = {
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
  subtitle?: JSX.Element
  icons?: HeaderIcon[]
  hideGoBackButton?: boolean
  theme?: 'default' | 'inverted'
  showPriceStats?: boolean
  style?: ViewProps['style']
} & (
  | {
      title?: string
      titleComponent?: never
    }
  | {
      title?: never
      titleComponent: JSX.Element
    }
)

const newThemes = {
  buyer: {
    bg: tw`bg-success-background-dark`,
    text: tw`text-success-main`,
    border: tw`border-success-mild-1`,
  },
  seller: {
    bg: tw`bg-primary-background-dark`,
    text: tw`text-primary-main`,
    border: tw`border-primary-mild-1`,
  },
  paymentTooLate: {
    bg: tw`bg-warning-mild-1`,
    text: tw`text-black-1`,
    border: tw`border-warning-mild-2`,
  },
  dispute: {
    bg: tw`bg-error-main`,
    text: tw`text-primary-background-light`,
    border: tw`border-error-dark`,
  },
  cancel: {
    bg: tw`bg-black-5`,
    text: tw`text-black-1`,
    border: tw`border-black-4`,
  },
  default: {
    bg: tw`bg-primary-background`,
    text: tw`text-black-1`,
    border: tw`border-primary-background-dark`,
  },
}
export const Header = ({
  showPriceStats,
  subtitle,
  ...props
}: Omit<HeaderConfig, 'theme' | 'style'> & { theme?: keyof typeof newThemes }) => (
  <SafeAreaView
    style={[
      tw`border-b rounded-b-lg`,
      newThemes[props.theme || 'default'].bg,
      newThemes[props.theme || 'default'].border,
    ]}
  >
    <HeaderNavigation {...props} />
    {showPriceStats && <Tickers />}
    {!!subtitle && subtitle}
  </SafeAreaView>
)

function HeaderNavigation ({
  title,
  icons,
  titleComponent,
  hideGoBackButton,
  theme = 'default',
}: Omit<HeaderConfig, 'theme' | 'style'> & { theme?: keyof typeof newThemes }) {
  const { goBack, canGoBack } = useNavigation()
  const { iconSize, fontSize } = getHeaderStyles()

  const shouldShowBackButton = !hideGoBackButton && canGoBack()
  return (
    <View
      style={[
        tw`flex-row items-center gap-2 py-6px px-sm`,
        tw.md`px-md`,
        shouldShowBackButton && [tw`pl-2`, tw.md`pl-26px`],
      ]}
    >
      <View style={tw`flex-row items-center flex-1 gap-1`}>
        {shouldShowBackButton && (
          <TouchableOpacity onPress={goBack}>
            <Icon
              id="chevronLeft"
              style={24}
              color={theme !== 'dispute' ? tw`text-black-2`.color : tw`text-primary-background-light`.color}
            />
          </TouchableOpacity>
        )}
        {titleComponent || (
          <Text
            style={[...fontSize, theme !== 'dispute' ? tw`text-black-1` : tw`text-primary-background-light`, tw`flex-1`]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>

      <View style={tw`flex-row items-center justify-end gap-10px`}>
        {icons?.map(({ id, accessibilityHint, color, onPress }, i) => (
          <TouchableOpacity key={`${i}-${id}`} style={tw`p-2px`} {...{ accessibilityHint, onPress }}>
            <Icon
              id={id}
              color={theme !== 'dispute' ? color : tw`text-primary-background-light`.color}
              style={iconSize}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const colStyle = [tw`flex-row items-center gap-2`, tw.md`flex-col items-start gap-0`]
const unitStyle = tw`subtitle-1`

type TickerProps = {
  type?: 'buy' | 'sell'
}

export function Tickers ({ type = 'sell' }: TickerProps) {
  const [currency, satsPerUnit, price] = useBitcoinStore(
    (state) => [state.currency, state.satsPerUnit, state.price],
    shallow,
  )
  const valueStyle = [tw`leading-xl`, type === 'sell' ? tw`text-primary-main` : tw`text-success-main`, tw.md`body-l`]

  return (
    <View style={[tw`flex-row items-center justify-between py-1 px-sm`, tw.md`px-md py-2px`]}>
      <View style={colStyle}>
        <Text style={unitStyle}>{`1 ${i18n('btc')}`}</Text>
        <PriceFormat style={valueStyle} currency={currency} amount={price} round />
      </View>
      <View style={[...colStyle, tw.md`items-end`]}>
        <Text style={[unitStyle, tw`text-right`]}>{`1 ${currency}`}</Text>
        <Text style={[...valueStyle, tw`text-right`]}>
          {i18n('currency.format.sats', thousands(round(satsPerUnit)))}
        </Text>
      </View>
    </View>
  )
}

type HeaderSubtitleProps = {
  theme?: keyof typeof newThemes
  amount: number
  premium: number
  viewer: 'buyer' | 'seller'
  text?: string
}
function HeaderSubtitle ({ theme = 'default', amount, premium, viewer, text }: HeaderSubtitleProps) {
  return (
    <View style={[tw`flex-row items-center justify-between py-2px px-sm`, tw.md`px-md py-2`]}>
      <Text style={[tw`subtitle-1`, newThemes[theme].text, tw.md`subtitle-0`]}>
        {text ?? i18n(viewer === 'buyer' ? 'buy.subtitle.highlight' : 'sell.subtitle.highlight')}
      </Text>
      <BTCAmount amount={amount} style={tw`pb-2px`} white={theme === 'dispute'} size="medium" />
      <Text style={[tw`subtitle-1 pt-3px`, newThemes[theme].text]}>
        {premium > 0 ? '+' : ''}
        {String(premium)}%
      </Text>
    </View>
  )
}

Header.Subtitle = HeaderSubtitle

/** @deprecated */
export const OldHeader = ({ title, icons, titleComponent, hideGoBackButton, showPriceStats, theme }: HeaderConfig) => {
  const colors = oldThemes[theme || 'default']
  const { goBack, canGoBack } = useNavigation()
  const { fontSize } = getHeaderStyles()

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
                <Icon id="chevronLeft" size={24} color={colors.backButton.color} />
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
                <Icon {...{ id, color }} size={24} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {showPriceStats && (
          <>
            <HorizontalLine />
            <Tickers />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}
