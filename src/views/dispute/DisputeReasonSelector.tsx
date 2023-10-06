import tw from '../../styles/tailwind'

import { OptionButton, PeachScrollView, Screen, Text } from '../../components'
import { useRoute } from '../../hooks'
import { contractIdToHex, getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useDisputeReasonSelectorSetup } from './hooks/useDisputeReasonSelectorSetup'

export const DisputeReasonSelector = () => {
  const { availableReasons, setReason } = useDisputeReasonSelectorSetup()
  const { contractId } = useRoute<'disputeReasonSelector'>().params
  const contract = getContract(contractId)

  return (
    <Screen header={i18n('dispute.disputeForTrade', contract ? contractIdToHex(contract.id) : '')}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center grow`} contentStyle={tw`gap-4`}>
        <Text style={tw`text-center h6`}>{i18n('contact.whyAreYouContactingUs')}</Text>
        {availableReasons.map((rsn) => (
          <OptionButton key={rsn} onPress={() => setReason(rsn)} style={tw`w-64`} narrow>
            {i18n(`dispute.reason.${rsn}`)}
          </OptionButton>
        ))}
      </PeachScrollView>
    </Screen>
  )
}
