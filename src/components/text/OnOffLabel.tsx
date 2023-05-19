import tw from '../../styles/tailwind'
import { Label, Props } from './Label'
import { PeachText } from './Text'

type OnOffLabelProps = Props & {
  active: boolean
}
export const OnOffLabel = ({ active, children, onPress }: OnOffLabelProps) => (
  <Label style={active ? tw`bg-primary-main border-primary-main` : tw`border-black-3`} onPress={onPress}>
    <PeachText style={[tw`button-medium`, active ? tw`text-primary-background-light` : tw`text-black-3`]}>
      {children}
    </PeachText>
  </Label>
)
