import React, { ReactElement } from 'react'
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { toDateFormat } from '../../utils/date'
import Icon from '../Icon'
import { PriceFormat, SatsFormat, Text } from '../text'

type LevelColorMap = {
  bg: Record<SummaryItemLevel, ViewStyle>
  border: Record<SummaryItemLevel, ViewStyle>
  text: Record<SummaryItemLevel, TextStyle>
}
const levelColorMap: LevelColorMap = {
  bg: {
    APP: tw`bg-primary-main`,
    SUCCESS: tw`bg-success-background`,
    WARN: tw`bg-warning-main`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-light`,
    DEFAULT: tw`bg-black-2`,
    WAITING: tw`bg-primary-mild-1`,
  },
  border: {
    APP: tw`border-primary-main`,
    SUCCESS: tw`border-success-main`,
    WARN: tw`border-warning-main`,
    ERROR: tw`border-error-main`,
    INFO: tw`border-info-light`,
    DEFAULT: tw`border-black-2`,
    WAITING: tw`border-primary-mild-1`,
  },
  text: {
    APP: tw`text-primary-background-light`,
    SUCCESS: tw`text-primary-background-light`,
    WARN: tw`text-black-1`,
    ERROR: tw`text-primary-background-light`,
    INFO: tw`text-primary-background-light`,
    DEFAULT: tw`text-primary-background-light`,
    WAITING: tw`text-black-2`,
  },
}

type SummaryItemProps = ComponentProps & {
  title: string
  icon?: ReactElement
  amount: number
  currency?: Currency
  price?: number
  date: Date
  action?: Action
  level?: SummaryItemLevel
}

export const SummaryItem = ({
  title,
  icon,
  amount,
  currency,
  price,
  date,
  action,
  level = 'DEFAULT',
  style,
}: SummaryItemProps): ReactElement => (
  <TouchableOpacity
    style={[tw`w-full rounded-xl`, tw`border`, levelColorMap.border[level], style]}
    onPress={action?.callback}
  >
    <View style={tw`flex flex-row items-center justify-between py-3 px-4 rounded-xl`}>
      <View>
        <Text style={tw`subtitle-1`}>{title}</Text>
        <View style={tw`flex flex-row items-center`}>
          {icon && <View style={tw`mr-1`}>{icon}</View>}
          <Text style={tw`text-xs text-black-2`}>{toDateFormat(date)}</Text>
        </View>
      </View>
      <View>
        <SatsFormat {...{ sats: amount }} />
        {!!price && !!currency && <PriceFormat style={tw`text-black-2 text-right`} {...{ amount: price, currency }} />}
      </View>
    </View>
    {!!action?.label && (
      <View style={[tw`flex flex-row items-center justify-center py-1 rounded-b-lg`, levelColorMap.bg[level]]}>
        <Icon id={action.icon} style={tw`w-4 mr-1 -mt-0.5`} color={levelColorMap.text[level].color} />
        <Text style={[tw`font-semibold`, levelColorMap.text[level]]}>{action.label}</Text>
      </View>
    )}
  </TouchableOpacity>
)
