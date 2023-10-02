import { View } from 'react-native'
import { Text } from '../../../components'
import { EmailInput } from '../../../components/inputs/EmailInput'
import { useNavigation, useValidatedState } from '../../../hooks'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import { isEmailRequiredForDispute } from '../../../utils/dispute'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import { useSubmitDisputeAcknowledgement } from '../hooks/helpers/useSubmitDisputeAcknowledgement'

type Props = {
  contract: Pick<Contract, 'id' | 'disputeReason' | 'amount'>
  view: ContractViewer
  disputeReason: DisputeReason
  email: string
  setEmail: Function
  action1: Action
  action2?: Action
}
const emailRules = { required: true, email: true }

export const DisputeRaisedNotice = ({ contract, view, disputeReason, email, setEmail }: Props) => {
  const [emailValue, setEmailValue, , emailErrors] = useValidatedState<string>(email, emailRules)
  const navigation = useNavigation()
  const submitDisputeAcknowledgement = useSubmitDisputeAcknowledgement()

  const updatePopup = usePopupStore((state) => state.updatePopup)

  const onSubmit = () => {
    submitDisputeAcknowledgement({ contractId: contract.id, disputeReason, email: emailValue })
  }

  const submitAndGoToChat = () => {
    onSubmit()
    navigation.replace('contractChat', { contractId: contract.id })
  }
  const onChange = (value: string) => {
    setEmailValue(value)
    setEmail(value)
    const action2 = (
      !isEmailRequiredForDispute(contract.disputeReason ?? 'other')
        ? {
          label: i18n('close'),
          icon: 'xSquare',
          callback: onSubmit,
        }
        : undefined
    ) satisfies Action | undefined

    const action1 = (
      isEmailRequiredForDispute(contract.disputeReason ?? 'other')
        ? {
          label: i18n('send'),
          icon: 'arrowRightCircle',
          callback: onSubmit,
        }
        : {
          label: i18n('goToChat'),
          icon: 'messageCircle',
          callback: submitAndGoToChat,
        }
    ) satisfies Action
    updatePopup({
      action1,
      action2,
    })
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
            onSubmit={onSubmit}
            value={emailValue}
            errorMessage={emailErrors}
          />
        </View>
      )}
    </>
  )
}
