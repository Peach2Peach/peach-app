import { useMemo, useRef, useState } from 'react'
import { Keyboard, TextInput, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Contract } from '../../../peach-api/src/@types/contract'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { EmailInput } from '../../components/inputs/EmailInput'
import { Input } from '../../components/inputs/Input'
import { useSetPopup } from '../../components/popup/Popup'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useValidatedState } from '../../hooks/useValidatedState'
import { DisputeRaisedSuccess } from '../../popups/dispute/hooks/DisputeRaisedSuccess'
import { useAccountStore } from '../../utils/account/account'
import { contractIdToHex } from '../../utils/contract/contractIdToHex'
import { getContractViewer } from '../../utils/contract/getContractViewer'
import { isEmailRequiredForDispute } from '../../utils/dispute/isEmailRequiredForDispute'
import i18n from '../../utils/i18n'
import { useDecryptedContractData } from '../contractChat/useDecryptedContractData'
import { LoadingScreen } from '../loading/LoadingScreen'
import { submitRaiseDispute } from './utils/submitRaiseDispute'

export const DisputeForm = () => {
  const { contractId } = useRoute<'disputeForm'>().params
  const { contract } = useContractDetails(contractId)

  return !contract ? <LoadingScreen /> : <DisputeFormScreen contract={contract} />
}

const required = { required: true }
function DisputeFormScreen ({ contract }: { contract: Contract }) {
  const navigation = useNavigation()
  const { reason, contractId } = useRoute<'disputeForm'>().params
  const { data: decrptedData } = useDecryptedContractData(contract)

  const emailRules = useMemo(
    () => ({ email: isEmailRequiredForDispute(reason), required: isEmailRequiredForDispute(reason) }),
    [reason],
  )
  const [email, setEmail, emailIsValid, emailErrors] = useValidatedState<string>('', emailRules)
  const [message, setMessage, messageIsValid, messageErrors] = useValidatedState<string>('', required)
  const [loading, setLoading] = useState(false)
  const isFormValid = emailIsValid && messageIsValid

  const account = useAccountStore((state) => state.account)

  const setPopup = useSetPopup()
  const showErrorBanner = useShowErrorBanner()

  const submit = async () => {
    Keyboard.dismiss()

    if (!decrptedData?.symmetricKey || !isFormValid) return
    setLoading(true)
    const [disputeRaised, disputeRaisedError] = await submitRaiseDispute({
      contract,
      reason,
      email,
      message,
      symmetricKey: decrptedData.symmetricKey,
    })
    if (disputeRaised) {
      navigation.navigate('contractChat', { contractId })
      setPopup(<DisputeRaisedSuccess view={getContractViewer(contract.seller.id, account)} />)
    } else {
      showErrorBanner(disputeRaisedError?.error)
    }
    setLoading(false)
  }

  let $message = useRef<TextInput>(null).current
  return (
    <Screen header={i18n('dispute.disputeForTrade', contractIdToHex(contractId))}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center grow`}>
        <View style={tw`justify-center h-full max-w-full`}>
          <EmailInput
            onChangeText={setEmail}
            onSubmitEditing={() => $message?.focus()}
            value={email}
            placeholder={i18n('form.userEmail.placeholder')}
            errorMessage={emailErrors}
          />
          <Input value={i18n(`dispute.reason.${reason}`)} disabled />
          <Input
            style={tw`h-40`}
            reference={(el) => ($message = el)}
            onChangeText={setMessage}
            value={message}
            multiline={true}
            placeholder={i18n('form.message.placeholder')}
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
