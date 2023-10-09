import { View } from 'react-native'
import { Text } from '../../../components'
import { EmailInput } from '../../../components/inputs'
import { useValidatedState } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import { WarningPopup } from '../../WarningPopup'
import { ClosePopupAction } from '../../actions'
import { LoadingPopupAction } from '../../actions/LoadingPopupAction'
import { useSubmitDisputeAcknowledgement } from '../hooks/helpers/useSubmitDisputeAcknowledgement'

const emailRules = {
  required: true,
  email: true,
}
type Props = {
  contract: Contract
  view: ContractViewer
}

export function DisputeRaisedPopup ({ contract, view }: Props) {
  const submitDisputeAcknowledgement = useSubmitDisputeAcknowledgement()
  const [email, setEmail, , emailErrors] = useValidatedState<string>('', emailRules)
  const submit = () => {
    submitDisputeAcknowledgement({
      contractId: contract.id,
      disputeReason: contract.disputeReason || 'other',
      email,
    })
  }
  return (
    <WarningPopup
      title={i18n('dispute.opened')}
      content={
        <View style={tw`gap-4`}>
          <Text>
            {i18n(
              `dispute.opened.counterparty.text.1.withEmail.${view}`,
              contractIdToHex(contract.id),
              thousands(contract.amount),
            )}
          </Text>

          <Text>{i18n('dispute.opened.counterparty.text.2.withEmail')}</Text>

          <View>
            <EmailInput
              style={tw`bg-warning-background`}
              onChange={setEmail}
              onSubmit={submit}
              value={email}
              errorMessage={emailErrors}
            />
          </View>
        </View>
      }
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-1`} />
          <LoadingPopupAction
            label={i18n('send')}
            iconId="arrowRightCircle"
            onPress={submit}
            reverseOrder
            textStyle={tw`text-black-1`}
          />
        </>
      }
    />
  )
}
