import tw from '../../styles/tailwind'
import { Label, Props } from './Label'
import { PeachText } from './Text'

export const TextLabel = ({ children, onPress }: Props) => (
  <Label style={tw`border-black-1`} onPress={onPress}>
    <PeachText style={tw`button-medium text-black-1`}>{children}</PeachText>
  </Label>
)
