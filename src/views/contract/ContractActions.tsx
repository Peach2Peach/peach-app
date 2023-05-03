import tw from '../../styles/tailwind'
import { ContractCTA } from './components/ContractCTA'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'

type Props = {
  contract: Contract
  view: 'buyer' | 'seller'
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export const ContractActions = ({ contract, view, ...contractCTAProps }: Props) => (
  <>
    {!!contract.isEmailRequired && <ProvideEmailButton {...{ contract, view }} style={tw`self-center mb-4`} />}
    <ContractCTA {...{ contract, view, ...contractCTAProps }} />
    {contract.tradeStatus === 'refundOrReviveRequired' && !!contract.disputeWinner && (
      <ResolveDisputeSliders {...{ contract }} />
    )}
    {contract.tradeStatus === 'releaseEscrow' && !!contract.disputeWinner && <ReleaseEscrowSlider {...{ contract }} />}
  </>
)
