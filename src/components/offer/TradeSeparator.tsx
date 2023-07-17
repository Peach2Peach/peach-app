import { ColorValue, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'
import { HorizontalLine } from '../ui'
import { Icon } from '../Icon'
import { IconType } from '../../assets/icons'

type Props = ComponentProps & {
  iconId?: IconType
  iconColor?: ColorValue
  text: string
  disputeActive?: boolean
}

export const TradeSeparator = ({ style, disputeActive, iconId, iconColor, text }: Props) => (
  <View style={[tw`flex-row items-center`, style]}>
    {iconId && (
      <Icon
        id={iconId}
        style={tw`w-4 h-4 mr-1`}
        color={iconColor || (disputeActive ? tw`text-error-main`.color : undefined)}
      />
    )}
    <Text style={[tw`mr-1 text-black-2`, disputeActive && tw`text-error-main`]}>{text}</Text>
    <HorizontalLine style={[tw`flex-grow ml-1`, disputeActive && tw`bg-error-mild`]} />
  </View>
)
