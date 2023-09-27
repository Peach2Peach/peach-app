import { useToggleBoolean, useValidatedState } from '../../../hooks'

const addressRules = {}
export const useNodeSetup = () => {
  // TODO use walletStore
  const [enabled, toggleEnabled] = useToggleBoolean(false)
  const [ssl, toggleSSL] = useToggleBoolean(false)
  const [address, setAddress, , addressErrors] = useValidatedState<string>('', addressRules)
  const isConnected = false

  const pasteAddress = () => {}
  const openQRScanner = () => {}
  const checkConnection = () => {}
  const save = () => {}

  return {
    enabled,
    toggleEnabled,
    ssl,
    toggleSSL,
    isConnected,
    address,
    setAddress,
    addressErrors,
    pasteAddress,
    openQRScanner,
    checkConnection,
  }
}
