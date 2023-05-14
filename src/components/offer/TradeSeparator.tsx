import { ColorValue } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { IconType } from '../../assets/icons'
import { Divider } from '../Divider'

type Props = ComponentProps &
  Pick<Contract, 'disputeActive'> & {
    iconId: IconType | undefined
    iconColor: ColorValue
    text: string
  }

export const TradeSeparator = ({ style, disputeActive, iconId, iconColor, text }: Props) => (
  <Divider
    type={disputeActive ? 'error' : 'light'}
    text={text}
    icon={iconId ? <Icon id={iconId} style={tw`w-4 h-4 mr-1`} color={iconColor} /> : undefined}
    style={style}
  />
)
