import { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import { EmailInput } from '../../../components/inputs/EmailInput'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import { isEmailRequired } from '../../../views/dispute/DisputeForm'

declare type DisputeRaisedNoticeProps = {
  contract: Contract
  view: ContractViewer
  disputeReason: DisputeReason
  submit: Function
  email: string
  setEmail: Function
  emailErrors: string[] | undefined
}

export default ({
  contract,
  view,
  disputeReason,
  submit,
  email,
  setEmail,
  emailErrors,
}: DisputeRaisedNoticeProps): ReactElement => (
  <>
    <Text>
      {isEmailRequired(disputeReason)
        ? i18n(
          `dispute.opened.counterparty.text.1.withEmail.${view}`,
          contractIdToHex(contract.id),
          thousands(contract.amount),
        )
        : i18n(
          `dispute.opened.counterparty.text.1.withoutEmail.${view}`,
          contractIdToHex(contract.id),
          thousands(contract.amount),
        )}
    </Text>
    <Text style={tw`mt-3`}>
      {isEmailRequired(disputeReason)
        ? i18n('dispute.opened.counterparty.text.2.withEmail')
        : i18n('dispute.opened.counterparty.text.2.withoutEmail')}
    </Text>

    {isEmailRequired(disputeReason) && (
      <View style={tw`mt-4`}>
        <EmailInput
          style={tw`bg-warning-background`}
          onChange={setEmail}
          onSubmit={() => {
            submit(contract, contract.disputeReason)
          }}
          value={email}
          placeholder={i18n('form.email.placeholder')}
          errorMessage={emailErrors}
        />
      </View>
    )}
  </>
)
