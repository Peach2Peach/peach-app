import { ColorValue, View } from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'
import { HorizontalLine } from '../ui'

type Props = ComponentProps & {
  text: string
  disputeActive?: boolean
  iconId?: IconType
  iconColor?: ColorValue | undefined
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
