import { PrimaryButton } from '../../../components'
import tw from '../../../styles/tailwind'
import { useDisputeRaisedNotice } from '../../../popups/dispute/hooks/useDisputeRaisedNotice'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'

export const ProvideEmailButton = ({ style }: ComponentProps) => {
  const { showDisputeRaisedNotice } = useDisputeRaisedNotice()
  const { contract, view } = useContractContext()
  const onPress = () => showDisputeRaisedNotice(contract, view)

  return (
    <PrimaryButton style={[tw`bg-error-main`, style]} onPress={onPress} iconId="alertCircle" narrow>
      {i18n('contract.provideEmail')}
    </PrimaryButton>
  )
}
