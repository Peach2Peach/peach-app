import { Contract } from '../../../peach-api/src/@types/contract'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { OptionButton } from '../../components/buttons/OptionButton'
import { useSetPopup } from '../../components/popup/Popup'
import { PeachText } from '../../components/text/PeachText'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { DisputeRaisedSuccess } from '../../popups/dispute/DisputeRaisedSuccess'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { contractIdToHex } from '../../utils/contract/contractIdToHex'
import { getContractViewer } from '../../utils/contract/getContractViewer'
import i18n from '../../utils/i18n'
import { useDecryptedContractData } from '../contractChat/useDecryptedContractData'
import { LoadingScreen } from '../loading/LoadingScreen'
import { submitRaiseDispute } from './utils/submitRaiseDispute'

export const DisputeReasonSelector = () => {
  const { contractId } = useRoute<'disputeReasonSelector'>().params
  const { contract } = useContractDetails(contractId)

  return !contract ? <LoadingScreen /> : <DisputeReasonScreen contract={contract} />
}

const disputeReasons: Record<ContractViewer, DisputeReason[]> = {
  buyer: ['noPayment.buyer', 'unresponsive.buyer', 'abusive', 'other'],
  seller: ['noPayment.seller', 'unresponsive.seller', 'abusive', 'other'],
}

function DisputeReasonScreen ({ contract }: { contract: Contract }) {
  const { data: decryptedData } = useDecryptedContractData(contract)
  const account = useAccountStore((state) => state.account)
  const view = getContractViewer(contract.seller.id, account)
  const availableReasons = view === 'seller' ? disputeReasons.seller : disputeReasons.buyer

  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const setPopup = useSetPopup()

  const setAndSubmit = async (reason: DisputeReason) => {
    const [success, error] = await submitRaiseDispute({
      contract,
      reason,
      symmetricKey: decryptedData?.symmetricKey,
      paymentData: decryptedData?.paymentData,
    })
    if (!success || error) {
      showErrorBanner(error?.error, [error?.details])
      return
    }
    if (view) setPopup(<DisputeRaisedSuccess view={view} />)
    navigation.goBack()
  }

  const setReason = async (reason: DisputeReason) => {
    if (reason === 'noPayment.buyer' || reason === 'noPayment.seller') {
      navigation.navigate('disputeForm', { contractId: contract.id, reason })
      return
    }

    await setAndSubmit(reason)
  }

  return (
    <Screen header={i18n('dispute.disputeForTrade', contract ? contractIdToHex(contract.id) : '')}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center grow`} contentStyle={tw`gap-4`}>
        <PeachText style={tw`text-center h6`}>{i18n('contact.whyAreYouContactingUs')}</PeachText>
        {availableReasons.map((rsn) => (
          <OptionButton key={rsn} onPress={() => setReason(rsn)} style={tw`w-64`}>
            {i18n(`dispute.reason.${rsn}`)}
          </OptionButton>
        ))}
      </PeachScrollView>
    </Screen>
  )
}
