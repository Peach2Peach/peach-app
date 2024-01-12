import { Button } from '../../components/buttons/Button'
import { useKeyboard } from '../../hooks/useKeyboard'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type Props = {
  onPress: () => void
  disabled: boolean
  loading: boolean
}

export function ShowOffersButton ({ onPress, disabled, loading }: Props) {
  const keyboardIsOpen = useKeyboard()
  if (keyboardIsOpen) return null
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
    >
      {i18n('offerPreferences.showOffers')}
    </Button>
  )
}
