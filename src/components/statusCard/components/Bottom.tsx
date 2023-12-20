import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Icon } from '../../Icon'
import { PeachText } from '../../text/PeachText'
import { StatusCardProps } from '../StatusCard'
import { statusCardStyles } from '../statusCardStyles'

type Props = Pick<StatusCardProps, 'labelIcon' | 'label' | 'unreadMessages' | 'color'>

export const Bottom = ({ labelIcon: icon, label: text, unreadMessages: messages, color }: Props) => {
  if (text === undefined) return null
  return (
    <View style={[tw`flex-row items-center justify-between gap-1 px-4 py-6px`, statusCardStyles.bg[color]]}>
      <Icon id="messageFull" style={tw`opacity-0 w-7 h-7`} color={tw.color(statusCardStyles.text[color])} />
      <View style={tw`flex-row items-center gap-1`}>
        {icon}
        <PeachText style={[tw`subtitle-1`, tw.style(statusCardStyles.text[color])]}>{text}</PeachText>
      </View>
      <View style={[tw`items-center justify-center w-7 h-7`, !messages && tw`opacity-0`]}>
        <Icon id="messageFull" style={tw`w-7 h-7`} color={tw.color('primary-background-light')} />
        <PeachText style={tw`absolute text-center font-baloo-bold`}>{messages}</PeachText>
      </View>
    </View>
  )
}
