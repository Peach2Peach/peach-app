import { Text, Pressable } from 'react-native'
import tw from '../../styles/tailwind'
import { HorizontalLine } from '../ui'

/**
 * @description Section containing city and name of the event
 */
declare type MeetupSummaryProps = {
  event: MeetupEvent
  onPress: () => void
}

export default ({ event, onPress }: MeetupSummaryProps) => (
  <Pressable onPress={onPress}>
    <Text style={tw`pl-5 input-label text-black-1`}>{event.city}</Text>
    <Text style={tw`pl-5 body-s text-black-1`}>{event.longName}</Text>
    <HorizontalLine style={tw`my-6`} />
  </Pressable>
)
