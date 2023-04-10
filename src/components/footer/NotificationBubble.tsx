import tw from '../../styles/tailwind'
import { Text } from '../text'

type Props = {
  notifications: number
}

export const NotificationBubble = ({ notifications }: Props) => (
  <Text
    numberOfLines={1}
    style={[
      tw`self-center body-s text-primary-background text-14px leading-20px`,
      notifications > 9 && tw`text-12px leading-18px`,
    ]}
  >
    {Math.min(99, notifications)}
  </Text>
)
