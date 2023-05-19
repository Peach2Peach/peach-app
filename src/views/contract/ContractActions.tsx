import tw from '../../styles/tailwind'
import { ContractCTA } from './components/ContractCTA'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { View } from 'react-native'
import { useContractContext } from './context'

type Props = ComponentProps & {
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export const ContractActions = ({ style, ...contractCTAProps }: Props) => {
  const { contract } = useContractContext()
  const { isEmailRequired, tradeStatus, disputeWinner } = contract
  return (
    <View style={[tw`gap-3`, style]}>
      {!!isEmailRequired && <ProvideEmailButton style={tw`self-center`} />}
      <ContractCTA {...{ ...contractCTAProps }} />
      {tradeStatus === 'refundOrReviveRequired' && !!disputeWinner && <ResolveDisputeSliders />}
      {tradeStatus === 'releaseEscrow' && !!disputeWinner && <ReleaseEscrowSlider {...{ contract }} />}
    </View>
  )
}
