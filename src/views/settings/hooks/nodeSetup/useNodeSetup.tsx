import { BlockChainNames } from 'bdk-rn/lib/lib/enums'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useToggleBoolean, useValidatedState } from '../../../../hooks'
import { useShowLoadingPopup } from '../../../../hooks/useShowLoadingPopup'
import i18n from '../../../../utils/i18n'
import { useNodeConfigState } from '../../../../utils/wallet/nodeConfigStore'
import { peachWallet } from '../../../../utils/wallet/setWallet'
import { checkNodeConnection } from '../../helpers/checkNodeConnection'
import { useShowNodeConnectionErrorPopup } from './useShowNodeConnectionErrorPopup'
import { useShowNodeConnectionSuccessPopup } from './useShowNodeConnectionSuccessPopup'

const urlRules = { required: true, url: true }
export const useNodeSetup = () => {
  const showLoadingPopup = useShowLoadingPopup()
  const showNodeConnectionSuccessPopup = useShowNodeConnectionSuccessPopup()
  const showNodeConnectionErrorPopup = useShowNodeConnectionErrorPopup()

  const [node, setCustomNode, enabled, toggleEnabled] = useNodeConfigState(
    (state) => [state, state.setCustomNode, state.enabled, state.toggleEnabled],
    shallow,
  )
  const [ssl, toggleSSL] = useToggleBoolean(node.ssl)
  const [url, setURL, isURLValid, urlErrors] = useValidatedState<string>(node.url || '', urlRules)
  const canCheckConnection = enabled && isURLValid
  const [isConnected, setIsConnected] = useState(!!node.url)

  const editConfig = () => setIsConnected(false)
  const save = (blockchainType: BlockChainNames) => {
    setCustomNode({ enabled, ssl, url, type: blockchainType })
    setIsConnected(true)
    peachWallet.setBlockchain({ enabled, ssl, url, type: blockchainType })
  }

  const checkConnection = async () => {
    showLoadingPopup({ title: i18n('wallet.settings.node.checkConnection') })

    const result = await checkNodeConnection(url, ssl)
    if (result.isOk()) {
      const nodeType = result.getValue()
      return showNodeConnectionSuccessPopup({ url, save: () => save(nodeType) })
    }
    return showNodeConnectionErrorPopup(result.getError())
  }

  useEffect(() => {
    peachWallet.setBlockchain({ ...node, enabled, url })
  }, [enabled, node, url])

  return {
    enabled,
    toggleEnabled,
    ssl,
    toggleSSL,
    isConnected,
    url,
    setURL,
    urlErrors,
    editConfig,
    canCheckConnection,
    checkConnection,
  }
}
