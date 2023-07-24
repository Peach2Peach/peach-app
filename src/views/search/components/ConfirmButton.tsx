import { PrimaryButton } from '../../../components'
import { useNavigation } from '../../../hooks'
import { usePatchOffer } from '../../../hooks/offer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  offerId: string
  newPremium: number
}
export const ConfirmButton = ({ offerId, newPremium }: Props) => {
  const { mutate: confirmPremium } = usePatchOffer(offerId, { premium: newPremium })
  const navigation = useNavigation()
  return (
    <PrimaryButton
      onPress={() => confirmPremium(undefined, { onSuccess: navigation.goBack })}
      style={tw`self-center mb-5`}
      narrow
    >
      {i18n('confirm')}
    </PrimaryButton>
  )
}
