import { Pressable } from 'react-native'
import { Text } from '../../text'
import { openAppLink } from '../../../utils/web'
import Icon from '../../Icon'
import tw from '../../../styles/tailwind'

type Props = { text: string; url: string }
export const Link = ({ text, url }: Props) => (
  <Pressable style={tw`flex-row items-center gap-1`} onPress={() => openAppLink(url)}>
    <Text style={tw`underline button-large text-black-2`}>{text}</Text>
    <Icon id={'externalLink'} style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
  </Pressable>
)
