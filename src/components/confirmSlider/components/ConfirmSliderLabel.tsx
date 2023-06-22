import tw from '../../../styles/tailwind'
import { Text } from '../../text'

export const ConfirmSliderLabel = ({ children }: ComponentProps) => (
  <Text style={tw`text-center button-large`} numberOfLines={1}>
    {children}
  </Text>
)
