import { Checkbox } from '../../../components/inputs/Checkbox'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  minReputation: number | null
  toggle: () => void
}

export function ReputationFilterComponent ({ minReputation, toggle }: Props) {
  const checked = minReputation === 4.5
  return (
    <Checkbox
      green
      checked={checked}
      onPress={toggle}
      text={i18n('offerPreferences.filters.minReputation', '4.5')}
      style={tw`self-stretch`}
    />
  )
}
