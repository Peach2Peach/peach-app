import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { act, renderHook } from '@testing-library/react-hooks'
import { useContractMessageHandler } from '../../../../src/hooks/notifications/useContractMessageHandler'
import { getContract } from '../../../../src/utils/contract'
import { getContract as getContractAPI } from '../../../../src/utils/peachAPI'
import { contract } from '../../data/contractData'

const contractPopupEventHandlerMock = jest.fn()
const ignoreGlobalEventMock = jest.fn().mockReturnValue(false)
const contractPopupEvents = { contractPopupEvent: contractPopupEventHandlerMock }
jest.mock('../../../../src/hooks/notifications/contract/useContractPopupEvents', () => ({
  useContractPopupEvents: () => ({ contractPopupEvents, ignoreGlobalEvent: ignoreGlobalEventMock }),
}))
jest.mock('../../../../src/utils/contract', () => ({
  getContract: jest.fn(),
}))
jest.mock('../../../../src/utils/peachAPI', () => ({
  getContract: jest.fn(),
}))

// eslint-disable-next-line max-lines-per-function
describe('useContractMessageHandler', () => {
  const contractId = '123-456'

  beforeEach(() => {
    ;(getContract as jest.Mock).mockReturnValue(contract)
    ;(getContractAPI as jest.Mock).mockResolvedValue([contract])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call popup event when type is found in popupEvents', async () => {
    const mockRemoteMessage = {
      data: {
        contractId,
        type: 'contractPopupEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useContractMessageHandler(contractId))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).toHaveBeenCalledWith(contract)
  })

  it('should not call popup event when type is not found in popupEvents', async () => {
    const mockRemoteMessage = {
      data: {
        contractId,
        type: 'someOtherEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useContractMessageHandler())
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).not.toHaveBeenCalled()
  })

  it('should not call popup event when contractId is missing in data', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'contractPopupEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useContractMessageHandler(contractId))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).not.toHaveBeenCalled()
  })

  it('should not call popup event when contract could not be loaded', async () => {
    const mockRemoteMessage = {
      data: {
        contractId,
        type: 'contractPopupEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    ;(getContract as jest.Mock).mockReturnValue(null)
    ;(getContractAPI as jest.Mock).mockResolvedValue([null])

    const { result: onMessageHandler } = renderHook(() => useContractMessageHandler(contractId))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).not.toHaveBeenCalled()
  })

  it('should not call popup event when data is undefined', async () => {
    const mockRemoteMessage = {
      data: undefined,
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useContractMessageHandler(contractId))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).not.toHaveBeenCalled()
  })

  it('should not call popup event when type is undefined', async () => {
    const mockRemoteMessage = {
      data: { someOtherData: 'someOtherData' },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useContractMessageHandler(contractId))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).not.toHaveBeenCalled()
  })
})
