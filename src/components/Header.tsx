import { useNavigation } from '@react-navigation/native'
import { ColorValue, ScrollView, TouchableOpacity, View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shallow } from 'zustand/shallow'
import { IconType } from '../assets/icons'
import { useBitcoinPrices } from '../hooks/useBitcoinPrices'
import { useToggleBoolean } from '../hooks/useToggleBoolean'
import { CURRENCIES } from '../paymentMethods'
import { useSettingsStore } from '../store/settingsStore'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { getHeaderStyles } from '../utils/layout/getHeaderStyles'
import { thousands } from '../utils/string/thousands'
import { Icon } from './Icon'
import { TouchableIcon } from './TouchableIcon'
import { BTCAmount } from './bitcoin/btcAmount/BTCAmount'
import { PeachText } from './text/PeachText'
import { PriceFormat } from './text/PriceFormat'

export type HeaderIcon = {
  id: IconType
  accessibilityHint?: string
  color?: ColorValue | undefined
  onPress: () => void
}

type HeaderConfig = {
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
    title: tw`text-black-100`,
    subtitle: tw`text-success-main`,
    border: tw`border-success-mild-1`,
    backButtonColor: tw.color('black-65'),
  },
  seller: {
    bg: tw`bg-primary-background-dark`,
    title: tw`text-black-100`,
    subtitle: tw`text-primary-main`,
    border: tw`border-primary-mild-1`,
    backButtonColor: tw.color('black-65'),
  },
  paymentTooLate: {
    bg: tw`bg-warning-mild-1`,
    title: tw`text-black-100`,
    subtitle: tw`text-black-100`,
    border: tw`border-warning-mild-2`,
    backButtonColor: tw.color('black-65'),
  },
  dispute: {
    bg: tw`bg-error-main`,
    title: tw`text-primary-background-light`,
    subtitle: tw`text-primary-background-light`,
    border: tw`border-error-dark`,
    backButtonColor: tw.color('primary-background-light'),
  },
  cancel: {
    bg: tw`bg-black-10`,
    title: tw`text-black-100`,
    subtitle: tw`text-black-100`,
    border: tw`border-black-25`,
    backButtonColor: tw.color('black-65'),
  },
  default: {
    bg: tw`bg-primary-background-main`,
    title: tw`text-black-100`,
    subtitle: tw`text-black-100`,
    border: tw`border-primary-background-dark`,
    backButtonColor: tw.color('black-65'),
  },
  transparent: {
    bg: tw`bg-transparent`,
    title: tw`text-primary-background-light`,
    subtitle: tw`text-primary-background-light`,
    border: tw`border-transparent`,
    backButtonColor: tw.color('primary-background-light'),
  },
}

export type HeaderProps = Omit<HeaderConfig, 'theme' | 'style'> & { theme?: keyof typeof newThemes }

export const Header = ({ showPriceStats, subtitle, ...props }: HeaderProps) => {
  const { top } = useSafeAreaInsets()
  return (
    <View
      style={[
        tw`border-b rounded-b-lg`,
        { paddingTop: top, zIndex: 1 },
        newThemes[props.theme || 'default'].bg,
        newThemes[props.theme || 'default'].border,
      ]}
    >
      {showPriceStats && <Tickers />}
      {(props.title || props.titleComponent) && <HeaderNavigation {...props} />}
      {!!subtitle && subtitle}
    </View>
  )
}

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
        tw`md:px-md`,
        shouldShowBackButton && [tw`pl-0`, tw`md:pl-10px`],
      ]}
    >
      <View style={tw`flex-row items-center flex-1 gap-1`}>
        {shouldShowBackButton && (
          <TouchableOpacity onPress={goBack}>
            <Icon id="chevronLeft" style={24} color={newThemes[theme].backButtonColor} />
          </TouchableOpacity>
        )}
        {titleComponent || (
          <PeachText style={[...fontSize, newThemes[theme].title, tw`flex-1`]} numberOfLines={1}>
            {title}
          </PeachText>
        )}
      </View>

      <View style={tw`flex-row items-center justify-end gap-10px`}>
        {icons?.map(({ id, accessibilityHint, color, onPress }, i) => (
          <TouchableOpacity key={`${i}-${id}`} style={tw`p-2px`} {...{ accessibilityHint, onPress }}>
            <Icon id={id} color={theme !== 'dispute' ? color : tw.color('primary-background-light')} style={iconSize} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const colStyle = [tw`flex-row flex-1 gap-2`, tw`md:flex-col md:gap-0`]
const leftColStyle = [...colStyle, tw`justify-start md:items-start`]
const rightColStyle = [...colStyle, tw`justify-end md:items-end`]
const unitStyle = tw`subtitle-1`

type TickerProps = {
  type?: 'buy' | 'sell'
}

function Tickers ({ type = 'sell' }: TickerProps) {
  const { bitcoinPrice, moscowTime, displayCurrency } = useBitcoinPrices()
  const valueStyle = [tw`leading-xl`, type === 'sell' ? tw`text-primary-main` : tw`text-success-main`, tw`md:body-l`]
  return (
    <View style={[tw`flex-row items-center justify-between py-1 px-sm`, tw`md:px-md md:py-2px`]}>
      <View style={leftColStyle}>
        <PeachText style={unitStyle}>{`1 ${i18n('btc')}`}</PeachText>
        <PriceFormat style={valueStyle} currency={displayCurrency} amount={bitcoinPrice} round />
      </View>
      <View style={rightColStyle}>
        <CurrencyScrollView />

        <PeachText style={[...valueStyle, tw`text-right`]}>
          {i18n('currency.format.sats', thousands(moscowTime))}
        </PeachText>
      </View>
    </View>
  )
}

function CurrencyScrollView () {
  const [showCurrencies, toggle] = useToggleBoolean()
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  )
  const borderWidth = 1

  return (
    <TouchableOpacity onPress={toggle} style={[tw`items-end flex-1 w-full grow`, { zIndex: 1 }]}>
      <ScrollView
        style={tw`absolute bg-primary-background-main max-h-40`}
        contentContainerStyle={[
          tw`items-end self-end justify-end`,
          !showCurrencies && { padding: borderWidth },
          showCurrencies && tw`pl-2 border rounded-lg border-black-25`,
        ]}
        scrollEnabled={showCurrencies}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`items-start`} onStartShouldSetResponder={() => showCurrencies}>
          <View style={tw`flex-row items-center gap-1`}>
            <PeachText style={unitStyle}>{`1 ${displayCurrency}`}</PeachText>
            <TouchableIcon
              id={showCurrencies ? 'chevronUp' : 'chevronDown'}
              onPress={toggle}
              iconColor={tw.color('black-100')}
            />
          </View>
          {showCurrencies
            && CURRENCIES.filter((c) => c !== displayCurrency).map((c) => (
              <PeachText
                onPress={() => {
                  setDisplayCurrency(c)
                  toggle()
                }}
                key={c}
                style={unitStyle}
              >{`1 ${c}`}</PeachText>
            ))}
        </View>
      </ScrollView>
    </TouchableOpacity>
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
    <View style={[tw`flex-row items-center justify-between py-2px px-sm`, tw`md:px-md md:py-2`]}>
      <PeachText style={[tw`subtitle-1`, newThemes[theme].subtitle, tw`md:subtitle-0`]}>
        {text ?? i18n(viewer === 'buyer' ? 'buy.subtitle.highlight' : 'sell.subtitle.highlight')}
      </PeachText>
      <BTCAmount amount={amount} style={tw`pb-2px`} white={theme === 'dispute'} size="medium" />
      <PeachText style={[tw`subtitle-1 pt-3px`, newThemes[theme].subtitle]}>
        {premium > 0 ? '+' : ''}
        {String(premium)}%
      </PeachText>
    </View>
  )
}

Header.Subtitle = HeaderSubtitle
