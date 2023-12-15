import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Bottom } from './components/Bottom'
import { Top } from './components/Top'
import { statusCardStyles } from './statusCardStyles'

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
