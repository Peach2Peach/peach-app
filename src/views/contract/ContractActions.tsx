import tw from '../../styles/tailwind'
import { ContractCTA } from './components/ContractCTA'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { View } from 'react-native'

type Props = {
  contract: Contract
  view: 'buyer' | 'seller'
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export const ContractActions = ({ contract, view, ...contractCTAProps }: Props) => (
  <View style={tw`gap-3`}>
    {!!contract.isEmailRequired && <ProvideEmailButton {...{ contract, view }} style={tw`self-center`} />}
    <ContractCTA {...{ contract, view, ...contractCTAProps }} />
    {contract.tradeStatus === 'refundOrReviveRequired' && !!contract.disputeWinner && (
      <ResolveDisputeSliders {...{ contract }} />
    )}
    {contract.tradeStatus === 'releaseEscrow' && !!contract.disputeWinner && <ReleaseEscrowSlider {...{ contract }} />}
  </View>
)
