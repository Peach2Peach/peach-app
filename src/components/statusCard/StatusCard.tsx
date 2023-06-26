import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Bottom, Top } from './components'

export const statusCardStyles = {
  bg: {
    primary: tw`bg-primary-main`,
    error: tw`bg-error-main`,
    success: tw`bg-success-main`,
    'primary-mild': tw`bg-primary-mild-1`,
    warning: tw`bg-warning-main`,
    info: tw`bg-info-mild`,
    black: tw`bg-black-3`,
  },
  border: {
    primary: tw`border-primary-main`,
    error: tw`border-error-main`,
    success: tw`border-success-main`,
    'primary-mild': tw`border-primary-mild-1`,
    warning: tw`border-warning-main`,
    info: tw`border-info-mild`,
    black: tw`border-black-3`,
  },
  text: {
    primary: tw`text-primary-background-light`,
    error: tw`text-primary-background-light`,
    success: tw`text-primary-background-light`,
    'primary-mild': tw`text-black-2`,
    warning: tw`text-black-1`,
    info: tw`text-black-1`,
    black: tw`text-primary-background-light`,
  },
}

export type StatusCardProps = {
  title: string
  icon?: JSX.Element
  subtext: string
  amount?: number | [number, number]
  price?: number
  currency?: Currency
  label?: string
  labelIcon?: JSX.Element
  onPress: () => void
  unreadMessages?: number
  color: keyof typeof statusCardStyles.bg
  replaced?: boolean
}

export const StatusCard = (props: StatusCardProps) => (
  <TouchableOpacity onPress={props.onPress}>
    <View
      style={[tw`overflow-hidden border rounded-xl bg-primary-background-light`, statusCardStyles.border[props.color]]}
    >
      <Top {...props} />
      <Bottom {...props} />
    </View>
  </TouchableOpacity>
)
