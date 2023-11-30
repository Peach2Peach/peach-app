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
    primary: 'border-primary-main',
    error: 'border-error-main',
    success: 'border-success-main',
    'primary-mild': 'border-primary-mild-1',
    warning: 'border-warning-main',
    info: 'border-info-mild',
    black: 'border-black-3',
  },
  text: {
    primary: 'text-primary-background-light',
    error: 'text-primary-background-light',
    success: 'text-primary-background-light',
    'primary-mild': 'text-black-2',
    warning: 'text-black-1',
    info: 'text-black-1',
    black: 'text-primary-background-light',
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
      style={[
        tw`overflow-hidden border rounded-xl bg-primary-background-light`,
        tw.style(statusCardStyles.border[props.color]),
      ]}
    >
      <Top {...props} />
      <Bottom {...props} />
    </View>
  </TouchableOpacity>
)
