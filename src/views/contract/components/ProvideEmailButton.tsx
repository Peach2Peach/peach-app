import { PrimaryButton } from '../../../components'
import tw from '../../../styles/tailwind'
import { useDisputeRaisedNotice } from '../../../overlays/dispute/hooks/useDisputeRaisedNotice'

type Props = ComponentProps & {
  contract: Contract
  view: ContractViewer
}
export const ProvideEmailButton = ({ contract, view, style }: Props) => {
  const { showDisputeRaisedNotice } = useDisputeRaisedNotice()
  const onPress = () => showDisputeRaisedNotice(contract, view)

  return (
    <PrimaryButton style={[tw`bg-error-main`, style]} onPress={onPress} iconId="alertCircle" narrow>
      provide email
    </PrimaryButton>
  )
}
