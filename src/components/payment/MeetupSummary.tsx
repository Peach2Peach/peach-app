import { Pressable, Text } from 'react-native'
import tw from '../../styles/tailwind'
import { HorizontalLine } from '../ui'

declare type Props = {
  event: Pick<MeetupEvent, 'city' | 'longName'>
  onPress: () => void
}

export const MeetupSummary = ({ event: { city, longName }, onPress }: Props) => (
  <Pressable onPress={onPress}>
    <Text style={tw`pl-5 input-label text-black-1`}>{city}</Text>
    <Text style={tw`pl-5 body-s text-black-1`}>{longName}</Text>
    <HorizontalLine style={tw`my-6`} />
  </Pressable>
)
