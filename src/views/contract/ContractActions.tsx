import tw from '../../styles/tailwind'
import { ContractCTA } from './components/ContractCTA'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { View } from 'react-native'
import { useContractContext } from './context'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { PrimaryButton } from '../../components'
import i18n from '../../utils/i18n'

type Props = ComponentProps & {
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
  hasNewOffer: boolean
  goToNewOffer: () => void
}
export const ContractActions = ({ style, hasNewOffer, goToNewOffer, ...contractCTAProps }: Props) => {
  const { contract } = useContractContext()
  const { isEmailRequired, tradeStatus, disputeWinner } = contract
  const shouldShowReleaseEscrow = tradeStatus === 'releaseEscrow' && !!disputeWinner
  return (
    <View style={[tw`gap-3`, style]}>
      <ContractStatusInfo {...contractCTAProps} />
      {!!isEmailRequired && <ProvideEmailButton style={tw`self-center`} />}
      {hasNewOffer && <PrimaryButton onPress={goToNewOffer}>{i18n('contract.goToNewTrade')}</PrimaryButton>}
      {!shouldShowReleaseEscrow && <ContractCTA {...{ ...contractCTAProps }} />}
      {tradeStatus === 'refundOrReviveRequired' && !!disputeWinner && <ResolveDisputeSliders />}
      {shouldShowReleaseEscrow && <ReleaseEscrowSlider {...{ contract }} />}
    </View>
  )
}
