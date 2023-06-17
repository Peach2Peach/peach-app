import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { toDateFormat } from '../../utils/date'
import Icon from '../Icon'
import { PriceFormat, SatsFormat, Text } from '../text'

type ThemeConfig = {
  bg: Record<SummaryItemLevel, ViewStyle>
  border: Record<SummaryItemLevel, ViewStyle>
  text: Record<SummaryItemLevel, TextStyle>
}
const themes: Record<string, ThemeConfig> = {
  default: {
    bg: {
      APP: tw`bg-primary-main`,
      SUCCESS: tw`bg-success-main`,
      WARN: tw`bg-warning-main`,
      ERROR: tw`bg-error-main`,
      INFO: tw`bg-info-light`,
      DEFAULT: tw`bg-black-3`,
      WAITING: tw`bg-primary-mild-1`,
    },
    border: {
      APP: tw`border-primary-main`,
      SUCCESS: tw`border-success-main`,
      WARN: tw`border-warning-main`,
      ERROR: tw`border-error-main`,
      INFO: tw`border-info-light`,
      DEFAULT: tw`border-black-3`,
      WAITING: tw`border-primary-mild-1`,
    },
    text: {
      APP: tw`text-primary-background-light`,
      SUCCESS: tw`text-black-6`,
      WARN: tw`text-black-1`,
      ERROR: tw`text-primary-background-light`,
      INFO: tw`text-primary-background-light`,
      DEFAULT: tw`text-primary-background-light`,
      WAITING: tw`text-black-2`,
    },
  },
  light: {
    bg: {
      APP: tw`bg-primary-mild-2`,
      SUCCESS: tw`bg-success-mild`,
      WARN: tw`bg-warning-main`,
      ERROR: tw`bg-error-main`,
      INFO: tw`bg-info-light`,
      DEFAULT: tw`bg-black-5`,
      WAITING: tw`bg-primary-mild-1`,
    },
    border: {
      APP: tw`border-primary-mild-2`,
      SUCCESS: tw`border-success-main`,
      WARN: tw`border-warning-main`,
      ERROR: tw`border-error-main`,
      INFO: tw`border-info-light`,
      DEFAULT: tw`border-black-5`,
      WAITING: tw`border-primary-mild-1`,
    },
    text: {
      APP: tw`text-black-1`,
      SUCCESS: tw`text-black-1`,
      WARN: tw`text-black-1`,
      ERROR: tw`text-primary-background-light`,
      INFO: tw`text-primary-background-light`,
      DEFAULT: tw`text-black-1`,
      WAITING: tw`text-black-2`,
    },
  },
}

type SummaryItemProps = ComponentProps & {
  title: string
  icon?: JSX.Element
  amount: number | [number, number]
  currency?: Currency
  price?: number
  date: Date
  action?: Action
  level?: SummaryItemLevel
  theme?: 'default' | 'light'
}

export const StatusCard = ({
  title,
  icon,
  amount,
  currency,
  price,
  date,
  action,
  level = 'DEFAULT',
  theme = 'default',
  style,
}: SummaryItemProps) => {
  const [amount1, amount2] = Array.isArray(amount) ? amount : [amount]

  return (
    <TouchableOpacity
      style={[tw`w-full rounded-xl bg-primary-background-light`, tw`border`, themes[theme].border[level], style]}
      onPress={action?.callback}
    >
      <View style={tw`flex flex-row items-center justify-between px-4 py-3 rounded-xl`}>
        <View>
          <Text style={tw`subtitle-1`}>{title}</Text>
          <View style={tw`flex flex-row items-center`}>
            {icon && <View style={tw`mr-1`}>{icon}</View>}
            <Text style={tw`text-xs text-black-2`}>{toDateFormat(date)}</Text>
          </View>
        </View>
        <View>
          {!!amount1 && <SatsFormat sats={amount1} />}
          {amount2 ? (
            <View>
              <Text style={tw`absolute w-full overflow-visible text-center bottom-3 text-3xs text-black-3`}>~</Text>
              <SatsFormat sats={amount2} satsContainerStyle={tw`justify-end flex-1`} />
            </View>
          ) : !!price && !!currency ? (
            <PriceFormat style={tw`text-right text-black-2`} {...{ amount: price, currency }} />
          ) : (
            <Text> </Text>
          )}
        </View>
      </View>
      {!!action?.label && (
        <View style={[tw`flex flex-row items-center justify-center py-2 rounded-b-lg`, themes[theme].bg[level]]}>
          {!!action.icon && (
            <Icon id={action.icon} style={tw`w-4 mr-1 -mt-0.5`} color={themes[theme].text[level].color} />
          )}
          <Text style={[tw`font-semibold`, themes[theme].text[level]]}>{action.label}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
