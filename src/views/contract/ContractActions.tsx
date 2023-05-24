import tw from '../../styles/tailwind'
import { ContractCTA } from './components/ContractCTA'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { View } from 'react-native'
import { useContractContext } from './context'
import { ContractStatusInfo } from './components/ContractStatusInfo'

type Props = ComponentProps & {
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export const ContractActions = ({ style, ...contractCTAProps }: Props) => {
  const { contract } = useContractContext()
  const { isEmailRequired, tradeStatus, disputeWinner } = contract
  const shouldShowReleaseEscrow = tradeStatus === 'releaseEscrow' && !!disputeWinner
  return (
    <View style={[tw`gap-3`, style]}>
      <ContractStatusInfo {...contractCTAProps} />
      {!!isEmailRequired && <ProvideEmailButton style={tw`self-center`} />}
      {!shouldShowReleaseEscrow && <ContractCTA {...{ ...contractCTAProps }} />}
      {tradeStatus === 'refundOrReviveRequired' && !!disputeWinner && <ResolveDisputeSliders />}
      {shouldShowReleaseEscrow && <ReleaseEscrowSlider {...{ contract }} />}
    </View>
  )
}
