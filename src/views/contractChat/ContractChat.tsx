import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { useMemo } from 'react'
import { Header, Loading, Screen } from '../../components'
import { MessageInput } from '../../components/inputs/MessageInput'
import { useRoute } from '../../hooks'
import { useOpenDispute } from '../../popups/dispute/hooks/useOpenDispute'
import { useConfirmCancelTrade } from '../../popups/tradeCancelation'
import { account } from '../../utils/account'
import { canCancelContract, canOpenDispute, contractIdToHex, getContractViewer } from '../../utils/contract'
import { headerIcons } from '../../utils/layout'
import { ChatBox } from './components/ChatBox'
import { useContractChatSetup } from './hooks/useContractChatSetup'

export const ContractChat = () => {
  const { contract, tradingPartner, connected, onChangeMessage, submit, disableSend, newMessage, ...chatboxProps }
    = useContractChatSetup()

  return !contract ? (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
    <Screen style={tw`p-0`} header={<ContractChatHeader contract={contract} />}>
      <View style={[tw`grow`, !contract.symmetricKey && tw`opacity-50`]}>
        <ChatBox tradingPartner={tradingPartner?.id || ''} online={connected} {...chatboxProps} />
      </View>
      {contract.isChatActive && (
        <View style={tw`w-full`}>
          <MessageInput
            onChangeText={onChangeMessage}
            onSubmit={submit}
            disabled={!contract.symmetricKey}
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
}

function ContractChatHeader ({ contract }: Props) {
  const view = getContractViewer(contract, account)
  const { contractId } = useRoute<'contractChat'>().params

  const { showConfirmPopup } = useConfirmCancelTrade()
  const openDisputePopup = useOpenDispute(contractId)

  const memoizedIcons = useMemo(() => {
    if (contract?.disputeActive) return []

    const canCancel = canCancelContract(contract, view)
    const canDispute = canOpenDispute(contract, view)

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
  }, [contract, openDisputePopup, showConfirmPopup, view])

  return <Header title={contractIdToHex(contractId)} icons={memoizedIcons} />
}
