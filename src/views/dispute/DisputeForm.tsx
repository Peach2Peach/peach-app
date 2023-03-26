import { ReactElement, useMemo, useRef, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Input, PeachScrollView, PrimaryButton } from '../../components'
import { getContract, getContractViewer, getOfferHexIdFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { useHeaderSetup, useNavigation, useRoute, useValidatedState } from '../../hooks'
import { submitRaiseDispute } from './utils/submitRaiseDispute'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useDisputeRaisedSuccess } from '../../overlays/dispute/hooks/useDisputeRaisedSuccess'
import { account } from '../../utils/account'
import { EmailInput } from '../../components/inputs/EmailInput'

export const isEmailRequired = (reason: DisputeReason | '') => /noPayment.buyer|noPayment.seller/u.test(reason)
const required = { required: true }

export default (): ReactElement => {
  const route = useRoute<'disputeForm'>()
  const navigation = useNavigation()

  const reason = route.params.reason
  const contractId = route.params.contractId
  const contract = getContract(contractId)

  const emailRules = useMemo(() => ({ email: isEmailRequired(reason), required: isEmailRequired(reason) }), [reason])
  const [email, setEmail, emailIsValid, emailErrors] = useValidatedState('', emailRules)
  const [message, setMessage, messageIsValid, messageErrors] = useValidatedState('', required)
  const [loading, setLoading] = useState(false)
  let $message = useRef<TextInput>(null).current

  const disputeRaisedOverlay = useDisputeRaisedSuccess()

  const showError = useShowErrorBanner()

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('dispute.disputeForTrade', !!contract ? getOfferHexIdFromContract(contract) : ''),
      }),
      [contract],
    ),
  )

  const submit = async () => {
    Keyboard.dismiss()

    if (!contract?.symmetricKey || !emailIsValid || !messageIsValid || !reason || !message) return

    setLoading(true)
    const disputeRaised = await submitRaiseDispute(contract, reason, email, message)
    if (disputeRaised) {
      navigation.navigate('contractChat', { contractId })
      disputeRaisedOverlay(getContractViewer(contract, account))
    } else {
      showError()
    }
    setLoading(false)
  }

  return (
    <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
      <View style={tw`justify-center h-full p-6 pb-20`}>
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
          reference={(el: any) => ($message = el)}
          onChange={setMessage}
          value={message}
          multiline={true}
          placeholder={i18n('form.message.placeholder')}
          autoCorrect={false}
          errorMessage={messageErrors}
        />
      </View>
      <PrimaryButton
        onPress={submit}
        loading={loading}
        disabled={loading || !emailIsValid || !messageIsValid}
        style={tw`absolute self-center bottom-8`}
        narrow
      >
        {i18n('confirm')}
      </PrimaryButton>
    </PeachScrollView>
  )
}
