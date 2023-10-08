import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Header, Screen } from '../../components'
import { MessageInput } from '../../components/inputs/MessageInput'
import { useRoute } from '../../hooks'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { useOpenDispute } from '../../popups/dispute/hooks/useOpenDispute'
import { useConfirmCancelTrade } from '../../popups/tradeCancelation'
import { account } from '../../utils/account'
import { canCancelContract, contractIdToHex, decryptContractData, getContractViewer } from '../../utils/contract'
import { headerIcons } from '../../utils/layout'
import { isCashTrade } from '../../utils/paymentMethod'
import { LoadingScreen } from '../loading/LoadingScreen'
import { ChatBox } from './components/ChatBox'
import { useContractChatSetup } from './hooks/useContractChatSetup'

export const useDecryptedContractData = (contract: Contract) =>
  useQuery({
    queryKey: ['contract', contract.id, 'decrytedData'],
    queryFn: async () => {
      const { symmetricKey, paymentData } = await decryptContractData(contract)
      if (!symmetricKey || !paymentData) throw new Error('Could not decrypt contract data')
      return { symmetricKey, paymentData }
    },
  })

export const ContractChat = () => {
  const { contractId } = useRoute<'contractChat'>().params
  const { contract } = useContractDetails(contractId)

  return !contract ? <LoadingScreen /> : <ChatScreen contract={contract} />
}

function ChatScreen ({ contract }: { contract: Contract }) {
  const { data: decryptedData } = useDecryptedContractData(contract)
  const { tradingPartner, connected, setNewMessage, submit, disableSend, newMessage, ...chatboxProps }
    = useContractChatSetup(contract)
  return (
    <Screen
      style={tw`p-0`}
      header={<ContractChatHeader contract={contract} symmetricKey={decryptedData?.symmetricKey} />}
    >
      <View style={[tw`grow`, !decryptedData?.symmetricKey && tw`opacity-50`]}>
        <ChatBox tradingPartner={tradingPartner?.id || ''} online={connected} {...chatboxProps} />
      </View>
      {contract.isChatActive && (
        <View style={tw`w-full`}>
          <MessageInput
            onChangeText={setNewMessage}
            onSubmit={submit}
            disabled={!decryptedData?.symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
          />
        </View>
      )}
    </Screen>
  )
}

type Props = {
  contract: Contract
  symmetricKey?: string
}

function ContractChatHeader ({ contract, symmetricKey }: Props) {
  const view = getContractViewer(contract, account)
  const { contractId } = useRoute<'contractChat'>().params

  const { showConfirmPopup } = useConfirmCancelTrade()
  const openDisputePopup = useOpenDispute(contractId)

  const memoizedIcons = useMemo(() => {
    if (contract?.disputeActive) return []

    const canCancel = canCancelContract(contract, view)
    const canDispute = canOpenDispute(contract, view, symmetricKey)

    const icons = []
    if (canCancel) {
      icons.push({
        ...headerIcons.cancel,
        onPress: () => showConfirmPopup(contract),
      })
    }
    if (canDispute) {
      icons.push({
        ...headerIcons.warning,
        onPress: openDisputePopup,
      })
    }
    return icons
  }, [contract, openDisputePopup, showConfirmPopup, symmetricKey, view])

  return <Header title={contractIdToHex(contractId)} icons={memoizedIcons} />
}

function canOpenDispute (contract: Contract, view: ContractViewer, symmetricKey?: string) {
  return (
    !!symmetricKey
    && ((!contract.disputeActive && !isCashTrade(contract.paymentMethod))
      || (view === 'seller' && contract.cancelationRequested))
  )
}
