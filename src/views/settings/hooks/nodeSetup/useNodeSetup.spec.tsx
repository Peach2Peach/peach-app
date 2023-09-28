import { act, renderHook } from '@testing-library/react-native'
import { Loading } from '../../../../components'
import { usePopupStore } from '../../../../store/usePopupStore'
import { getError, getResult } from '../../../../utils/result'
import { NodeConfig, useNodeConfigState } from '../../../../utils/wallet/nodeConfigStore'
import { useNodeSetup } from './useNodeSetup'

const checkNodeConnectionMock = jest.fn()
jest.mock('../../helpers/checkNodeConnection', () => ({
  checkNodeConnection: (...args: unknown[]) => checkNodeConnectionMock(...args),
}))
const showNodeConnectionSuccessPopupMock = jest.fn()
jest.mock('./useShowNodeConnectionSuccessPopup', () => ({
  useShowNodeConnectionSuccessPopup:
    () =>
      (...args: unknown[]) =>
        showNodeConnectionSuccessPopupMock(...args),
}))
const showNodeConnectionErrorPopupMock = jest.fn()
jest.mock('./useshowNodeConnectionErrorPopup', () => ({
  useShowNodeConnectionErrorPopup:
    () =>
      (...args: unknown[]) =>
        showNodeConnectionErrorPopupMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('useNodeSetup', () => {
  const address = 'blockstream.info'
  beforeEach(() => {
    useNodeConfigState.getState().reset()
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
      editConfig: expect.any(Function),
    })
  })
  it('should load setup from nodeConfigState', () => {
    const nodeSetup: NodeConfig = {
      enabled: true,
      ssl: true,
      address,
      type: 'electrum',
    }
    useNodeConfigState.getState().setCustomNode(nodeSetup)
    const { result } = renderHook(useNodeSetup)
    expect(result.current).toEqual({
      ...result.current,
      ...nodeSetup,
      type: undefined,
      canCheckConnection: true,
    })
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
      result.current.setAddress('https://')
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
  it('should successfully check connection and save config', async () => {
    const promise = Promise.resolve(getResult('esplora'))
    checkNodeConnectionMock.mockReturnValue(promise)
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setAddress(address)
    })
    act(() => {
      result.current.checkConnection()
    })

    expect(checkNodeConnectionMock).toHaveBeenCalledWith(address, false)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'clock',
        label: 'loading...',
      },
      closePopup: usePopupStore.getState().closePopup,
      content: (
        <Loading
          color="#F56522"
          style={{
            alignSelf: 'center',
            height: 64,
            width: 64,
          }}
        />
      ),
      level: 'APP',
      title: 'checking connection',
      visible: true,
    })
    await act(async () => {
      await promise
    })
    expect(showNodeConnectionSuccessPopupMock).toHaveBeenCalledWith({ address, save: expect.any(Function) })
    act(() => {
      showNodeConnectionSuccessPopupMock.mock.calls[0][0].save()
    })
    expect(result.current.isConnected).toBeTruthy()
    expect(useNodeConfigState.getState()).toEqual({
      ...useNodeConfigState.getState(),
      enabled: true,
      address,
      type: 'esplora',
    })
  })
  it('should show connection error popup if no connection could be made', async () => {
    const error = 'error'
    const promise = Promise.resolve(getError(error))
    checkNodeConnectionMock.mockReturnValue(promise)
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setAddress(address)
    })
    act(() => {
      result.current.checkConnection()
    })

    expect(checkNodeConnectionMock).toHaveBeenCalledWith(address, false)

    await act(async () => {
      await promise
    })
    expect(showNodeConnectionErrorPopupMock).toHaveBeenCalledWith(error)
  })
  it('should should set connected to false when calling editConfig', () => {
    const nodeSetup: NodeConfig = {
      enabled: true,
      ssl: true,
      address,
      type: 'electrum',
    }
    useNodeConfigState.getState().setCustomNode(nodeSetup)
    const { result } = renderHook(useNodeSetup)
    expect(result.current.isConnected).toBeTruthy()
    act(() => result.current.editConfig())
    expect(result.current.isConnected).toBeFalsy()
  })
})
