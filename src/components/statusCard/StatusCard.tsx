import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Bottom, Top } from './components'

export const statusCardStyles = {
  bg: {
    orange: tw`bg-primary-main`,
    red: tw`bg-error-main`,
    green: tw`bg-success-main`,
    mild: tw`bg-primary-mild-1`,
    yellow: tw`bg-warning-main`,
    blue: tw`bg-info-mild`,
    gray: tw`bg-black-3`,
  },
  border: {
    orange: tw`border-primary-main`,
    red: tw`border-error-main`,
    green: tw`border-success-main`,
    mild: tw`border-primary-mild-1`,
    yellow: tw`border-warning-main`,
    blue: tw`border-info-mild`,
    gray: tw`border-black-3`,
  },
  text: {
    orange: tw`text-primary-background-light`,
    red: tw`text-primary-background-light`,
    green: tw`text-primary-background-light`,
    mild: tw`text-black-2`,
    yellow: tw`text-black-1`,
    blue: tw`text-black-1`,
    gray: tw`text-primary-background-light`,
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
