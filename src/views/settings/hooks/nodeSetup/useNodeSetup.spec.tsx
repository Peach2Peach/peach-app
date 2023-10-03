import { act, renderHook } from '@testing-library/react-native'
import { BlockChainNames } from 'bdk-rn/lib/lib/enums'
import { PopupLoadingSpinner } from '../../../../../tests/unit/helpers/PopupLoadingSpinner'
import { usePopupStore } from '../../../../store/usePopupStore'
import { getError, getResult } from '../../../../utils/result'
import { PeachWallet } from '../../../../utils/wallet/PeachWallet'
import { NodeConfig, useNodeConfigState } from '../../../../utils/wallet/nodeConfigStore'
import { setPeachWallet } from '../../../../utils/wallet/setWallet'
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
jest.mock('./useShowNodeConnectionErrorPopup', () => ({
  useShowNodeConnectionErrorPopup:
    () =>
      (...args: unknown[]) =>
        showNodeConnectionErrorPopupMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('useNodeSetup', () => {
  const url = 'blockstream.info'
  beforeEach(() => {
    // @ts-expect-error mock PeachWallet doesn't need arguments
    setPeachWallet(new PeachWallet())
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
      url: '',
      urlErrors: ['this field is required', 'please enter a valid value'],
      setURL: expect.any(Function),
      canCheckConnection: false,
      checkConnection: expect.any(Function),
      editConfig: expect.any(Function),
    })
  })
  it('should load setup from nodeConfigState', () => {
    const nodeSetup: NodeConfig = {
      enabled: true,
      ssl: true,
      url,
      type: BlockChainNames.Electrum,
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
  it('should set url', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => result.current.setURL(url))
    expect(result.current.url).toBe(url)
  })
  it('should validate url', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setURL('https://')
    })
    expect(result.current.urlErrors).toEqual(['please enter a valid value'])
    expect(result.current.canCheckConnection).toBeFalsy()
  })
  it('canCheckConnection is true when enabled and url is configured and valid', () => {
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setURL(url)
    })
    expect(result.current.canCheckConnection).toBeTruthy()
  })
  it('should successfully check connection and save config', async () => {
    const promise = Promise.resolve(getResult('esplora'))
    checkNodeConnectionMock.mockReturnValue(promise)
    const { result } = renderHook(useNodeSetup)
    act(() => {
      result.current.toggleEnabled()
      result.current.setURL(url)
    })
    act(() => {
      result.current.checkConnection()
    })

    expect(checkNodeConnectionMock).toHaveBeenCalledWith(url, false)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'clock',
        label: 'loading...',
      },
      closePopup: usePopupStore.getState().closePopup,
      content: PopupLoadingSpinner,
      level: 'APP',
      title: 'checking connection',
      visible: true,
    })
    await act(async () => {
      await promise
    })
    expect(showNodeConnectionSuccessPopupMock).toHaveBeenCalledWith({ url, save: expect.any(Function) })
    act(() => {
      showNodeConnectionSuccessPopupMock.mock.calls[0][0].save()
    })
    expect(result.current.isConnected).toBeTruthy()
    expect(useNodeConfigState.getState()).toEqual({
      ...useNodeConfigState.getState(),
      enabled: true,
      url,
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
      result.current.setURL(url)
    })
    act(() => {
      result.current.checkConnection()
    })

    expect(checkNodeConnectionMock).toHaveBeenCalledWith(url, false)

    await act(async () => {
      await promise
    })
    expect(showNodeConnectionErrorPopupMock).toHaveBeenCalledWith(error)
  })
  it('should should set connected to false when calling editConfig', () => {
    const nodeSetup: NodeConfig = {
      enabled: true,
      ssl: true,
      url,
      type: BlockChainNames.Electrum,
    }
    useNodeConfigState.getState().setCustomNode(nodeSetup)
    const { result } = renderHook(useNodeSetup)
    expect(result.current.isConnected).toBeTruthy()
    act(() => result.current.editConfig())
    expect(result.current.isConnected).toBeFalsy()
  })
})