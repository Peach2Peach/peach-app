import { useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useValidatedState } from '../../../../hooks'
import { useShowLoadingPopup } from '../../../../hooks/useShowLoadingPopup'
import i18n from '../../../../utils/i18n'
import { NodeType, useNodeConfigState } from '../../../../utils/wallet/nodeConfigStore'
import { checkNodeConnection } from '../../helpers/checkNodeConnection'
import { useShowNodeConnectionErrorPopup } from './useShowNodeConnectionErrorPopup'
import { useShowNodeConnectionSuccessPopup } from './useShowNodeConnectionSuccessPopup'

const addressRules = { required: true, url: true }
export const useNodeSetup = () => {
  const showLoadingPopup = useShowLoadingPopup()
  const showNodeConnectionSuccessPopup = useShowNodeConnectionSuccessPopup()
  const showNodeConnectionErrorPopup = useShowNodeConnectionErrorPopup()

  const [node, setCustomNode, enabled, toggleEnabled, ssl, toggleSSL] = useNodeConfigState(
    (state) => [state, state.setCustomNode, state.enabled, state.toggleEnabled, state.ssl, state.toggleSSL],
    shallow,
  )
  const [address, setAddress, isAddressValid, addressErrors] = useValidatedState<string>(
    node.address || '',
    addressRules,
  )
  const canCheckConnection = enabled && isAddressValid
  const [isConnected, setIsConnected] = useState(!!node.address)

  const editConfig = () => setIsConnected(false)
  const save = (type: NodeType) => {
    setCustomNode({ enabled, ssl, address, type })
    setIsConnected(true)
  }

  const checkConnection = async () => {
    showLoadingPopup({ title: i18n('wallet.settings.node.checkConnection') })

    const result = await checkNodeConnection(address, ssl)
    if (result.isOk()) {
      const nodeType = result.getValue()
      return showNodeConnectionSuccessPopup({ address, save: () => save(nodeType) })
    }
    return showNodeConnectionErrorPopup(result.getError())
  }

  return {
    enabled,
    toggleEnabled,
    ssl,
    toggleSSL,
    isConnected,
    address,
    setAddress,
    addressErrors,
    editConfig,
    canCheckConnection,
    checkConnection,
  }
}
