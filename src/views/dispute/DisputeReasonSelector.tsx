import tw from '../../styles/tailwind'

import { Contract } from '../../../peach-api/src/@types/contract'
import { OptionButton, Text } from '../../components'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { useRoute } from '../../hooks'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { contractIdToHex } from '../../utils/contract/contractIdToHex'
import i18n from '../../utils/i18n'
import { LoadingScreen } from '../loading/LoadingScreen'
import { useDisputeReasonSelectorSetup } from './hooks/useDisputeReasonSelectorSetup'

export const DisputeReasonSelector = () => {
  const { contractId } = useRoute<'disputeReasonSelector'>().params
  const { contract } = useContractDetails(contractId)

  return !contract ? <LoadingScreen /> : <DisputeReasonScreen contract={contract} />
}

function DisputeReasonScreen ({ contract }: { contract: Contract }) {
  const { availableReasons, setReason } = useDisputeReasonSelectorSetup(contract)
  return (
    <Screen header={i18n('dispute.disputeForTrade', contract ? contractIdToHex(contract.id) : '')}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center grow`} contentStyle={tw`gap-4`}>
        <Text style={tw`text-center h6`}>{i18n('contact.whyAreYouContactingUs')}</Text>
        {availableReasons.map((rsn) => (
          <OptionButton key={rsn} onPress={() => setReason(rsn)} style={tw`w-64`}>
            {i18n(`dispute.reason.${rsn}`)}
          </OptionButton>
        ))}
      </PeachScrollView>
    </Screen>
  )
}
