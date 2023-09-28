import { shallow } from 'zustand/shallow'
import { useToggleBoolean, useValidatedState } from '../../../hooks'
import { useWalletState } from '../../../utils/wallet/walletStore'

const addressRules = { required: true, url: true }
export const useNodeSetup = () => {
  const [node, setCustomNode] = useWalletState((state) => [state.node, state.setCustomNode], shallow)
  const [enabled, toggleEnabled] = useToggleBoolean(node.enabled)
  const [ssl, toggleSSL] = useToggleBoolean(node.ssl)
  const [address, setAddress, isAddressValid, addressErrors] = useValidatedState<string>(
    node.address || '',
    addressRules,
  )
  const canCheckConnection = enabled && isAddressValid
  const isConnected = false

  const checkConnection = () => {}
  const save = () => setCustomNode({ enabled, ssl, address })

  return {
    enabled,
    toggleEnabled,
    ssl,
    toggleSSL,
    isConnected,
    address,
    setAddress,
    addressErrors,
    canCheckConnection,
    checkConnection,
  }
}
