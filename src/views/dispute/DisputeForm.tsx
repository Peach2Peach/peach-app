import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Contract } from '../../../peach-api/src/@types/contract'
import { Input, PeachScrollView, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
import { EmailInput } from '../../components/inputs/EmailInput'
import { useRoute } from '../../hooks'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { contractIdToHex } from '../../utils/contract/contractIdToHex'
import i18n from '../../utils/i18n'
import { LoadingScreen } from '../loading/LoadingScreen'
import { useDisputeFormSetup } from './hooks/useDisputeFormSetup'

export const DisputeForm = () => {
  const { contractId } = useRoute<'disputeForm'>().params
  const { contract } = useContractDetails(contractId)

  return !contract ? <LoadingScreen /> : <DisputeFormScreen contract={contract} />
}

function DisputeFormScreen ({ contract }: { contract: Contract }) {
  const { contractId } = useRoute<'disputeForm'>().params
  const { email, setEmail, emailErrors, reason, message, setMessage, messageErrors, isFormValid, submit, loading }
    = useDisputeFormSetup(contract)

  let $message = useRef<TextInput>(null).current
  return (
    <Screen header={i18n('dispute.disputeForTrade', contractIdToHex(contractId))}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center grow`}>
        <View style={tw`justify-center h-full max-w-full`}>
          <EmailInput
            onChange={setEmail}
            onSubmit={() => $message?.focus()}
            value={email}
            placeholder={i18n('form.userEmail.placeholder')}
            errorMessage={emailErrors}
          />
          <Input value={i18n(`dispute.reason.${reason}`)} disabled />
          <Input
            style={tw`h-40`}
            reference={(el) => ($message = el)}
            onChange={setMessage}
            value={message}
            multiline={true}
            placeholder={i18n('form.message.placeholder')}
            autoCorrect={false}
            errorMessage={messageErrors}
          />
        </View>
      </PeachScrollView>
      <Button onPress={submit} disabled={loading || !isFormValid} style={tw`self-center`}>
        {i18n('confirm')}
      </Button>
    </Screen>
  )
}
