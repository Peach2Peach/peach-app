import tw from '../../styles/tailwind'
import { SlideToUnlock } from '../../components/inputs'
import { useResolveDisputeActions } from './hooks/useResolveDisputeActions'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { View } from 'react-native'

export const ResolveDisputeSliders = ({ contract }: { contract: Contract }) => {
  const { republishOffer, startRefund } = useResolveDisputeActions()
  return (
    <View style={tw`gap-3`}>
      <SlideToUnlock style={tw`w-[263px]`} onUnlock={() => republishOffer(contract)} label1={i18n('republishOffer')} />
      <SlideToUnlock
        style={tw`w-[263px]`}
        onUnlock={() => startRefund(getSellOfferFromContract(contract))}
        label1={i18n('refundEscrow')}
      />
    </View>
  )
}
