import { act, renderHook } from '@testing-library/react-native'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useNodeSetup } from './useNodeSetup'

// eslint-disable-next-line max-lines-per-function
describe('useNodeSetup', () => {
  const address = 'blockstream.info'
  beforeEach(() => {
    useWalletState.getState().reset()
  })
  it('should return defaults', () => {
    const { result } = renderHook(useNodeSetup)
    expect(result.current).toEqual({
      enabled: false,
      toggleEnabled: expect.any(Function),
      ssl: false,
      toggleSSL: expect.any(Function),
      isConnected: false,
      address: '',
      addressErrors: ['this field is required', 'please enter a valid value'],
      setAddress: expect.any(Function),
      canCheckConnection: false,
      checkConnection: expect.any(Function),
    })
  })
  it('should load setup from walletState', () => {
    const nodeSetup = {
      enabled: true,
      ssl: true,
      address,
    }
    useWalletState.getState().setCustomNode(nodeSetup)
    const { result } = renderHook(useNodeSetup)
    expect(result.current).toEqual({
      ...result.current,
      ...nodeSetup,
      canCheckConnection: true,
    })
  })
  it('should toggle enable', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => result.current.toggleEnabled())
    expect(result.current.enabled).toBeTruthy()
  })
  it('should toggle ssl', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => result.current.toggleSSL())
    expect(result.current.ssl).toBeTruthy()
  })
  it('should set address', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => result.current.setAddress(address))
    expect(result.current.address).toBe(address)
  })
  it('should validate address', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setAddress('notavalidurl')
    })
    expect(result.current.addressErrors).toEqual(['please enter a valid value'])
    expect(result.current.canCheckConnection).toBeFalsy()
  })
  it('canCheckConnection is true when enabled and address is configured and valid', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setAddress(address)
    })
    expect(result.current.canCheckConnection).toBeTruthy()
  })
  it('should check connection', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setAddress(address)
    })
    act(() => {
      result.current.checkConnection()
    })
    expect() // TODO
  })
})
