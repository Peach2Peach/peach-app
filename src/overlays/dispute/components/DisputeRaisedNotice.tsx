import { UseMutateFunction } from '@tanstack/react-query'
import { useState } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import { EmailInput } from '../../../components/inputs/EmailInput'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import { isEmailRequiredForDispute } from '../../../utils/dispute'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'

declare type DisputeRaisedNoticeProps = {
  contract: Contract
  view: ContractViewer
  disputeReason: DisputeReason
  submit: UseMutateFunction<
    APISuccess,
    Error,
    {
      email: string
      disputeReason: DisputeReason
      contractId: string
    },
    {
      previousContract: Contract | undefined
    }
  >
  email: string
  setEmail: Function
  emailErrors: string[] | undefined
}

export default ({ contract, view, disputeReason, submit, email, setEmail, emailErrors }: DisputeRaisedNoticeProps) => {
  const [emailValue, setEmailValue] = useState<string>(email)

  const onChange = (value: string) => {
    setEmailValue(value)
    setEmail(value)
  }

  return (
    <>
      <Text>
        {isEmailRequiredForDispute(disputeReason)
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
        {isEmailRequiredForDispute(disputeReason)
          ? i18n('dispute.opened.counterparty.text.2.withEmail')
          : i18n('dispute.opened.counterparty.text.2.withoutEmail')}
      </Text>

      {isEmailRequiredForDispute(disputeReason) && (
        <View style={tw`mt-4`}>
          <EmailInput
            style={tw`bg-warning-background`}
            onChange={onChange}
            onSubmit={() => {
              submit({ contractId: contract.id, disputeReason, email: emailValue })
            }}
            value={emailValue}
            errorMessage={emailErrors}
          />
        </View>
      )}
    </>
  )
}
