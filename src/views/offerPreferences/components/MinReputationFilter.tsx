import { Checkbox } from '../../../components'
import tw from '../../../styles/tailwind'

type Props = {
  minReputation: number | null
  toggle: () => void
}

export function ReputationFilterComponent ({ minReputation, toggle }: Props) {
  const checked = minReputation === 4.5
  return <Checkbox green checked={checked} onPress={toggle} text="minimum reputation: 4.5" style={tw`self-stretch`} />
}
