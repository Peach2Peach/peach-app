import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { act, renderHook } from '@testing-library/react-hooks'
import { useMessageHandler } from '../../../../src/hooks/notifications/useMessageHandler'
import { getContract } from '../../../../src/utils/contract'
import { getContract as getContractAPI } from '../../../../src/utils/peachAPI'
import { contract } from '../../data/contractData'

const updateMessageMock = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => [undefined, updateMessageMock],
}))
const overlayEventHanderMock = jest.fn()
const overlayEvents = { overlayEvent: overlayEventHanderMock }
jest.mock('../../../../src/hooks/notifications/eventHandler/useOverlayEvents', () => ({
  useOverlayEvents: () => overlayEvents,
}))

const offerPopupEventHandlerMock = jest.fn()
const offerPopupEvents = { offerPopupEvent: offerPopupEventHandlerMock }
jest.mock('../../../../src/hooks/notifications/eventHandler/offer/useOfferPopupEvents', () => ({
  useOfferPopupEvents: () => offerPopupEvents,
}))
const contractPopupEventHandlerMock = jest.fn()
const contractPopupEvents = { contractPopupEvent: contractPopupEventHandlerMock }
jest.mock('../../../../src/hooks/notifications/eventHandler/contract/useContractPopupEvents', () => ({
  useContractPopupEvents: () => contractPopupEvents,
}))
jest.mock('../../../../src/utils/contract', () => ({
  getContract: jest.fn(),
}))
jest.mock('../../../../src/utils/peachAPI', () => ({
  getContract: jest.fn(),
}))

const stateUpdateEventHandlerMock = jest.fn()
const stateUpdateEvents = { stateUpdateEvent: stateUpdateEventHandlerMock }
jest.mock('../../../../src/hooks/notifications/eventHandler/useStateUpdateEvents', () => ({
  useStateUpdateEvents: () => stateUpdateEvents,
}))

const actionMock = {
  label: 'action',
  icon: 'icon',
  callback: jest.fn(),
}
const getPNActionHandlerMock = jest.fn().mockReturnValue(actionMock)
jest.mock('../../../../src/hooks/notifications/useGetPNActionHandler', () => ({
  useGetPNActionHandler: () => getPNActionHandlerMock,
}))

// eslint-disable-next-line max-lines-per-function
describe('useMessageHandler', () => {
  const mockGetCurrentPage = () => 'home' as keyof RootStackParamList

  beforeEach(() => {
    ;(getContract as jest.Mock).mockReturnValue(contract)
    ;(getContractAPI as jest.Mock).mockResolvedValue([contract])
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call updateMessage when type is not found', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'SOME_TYPE',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(updateMessageMock).toHaveBeenCalledWith({
      msgKey: 'notification.SOME_TYPE',
      bodyArgs: ['arg1', 'arg2'],
      level: 'WARN',
      action: actionMock,
    })
  })

  it('should call overlay event when type is found in overlayEvents', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'overlayEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(overlayEventHanderMock).toHaveBeenCalledWith(mockRemoteMessage.data)
  })

  it('should call popup event when type is found in offerPopupEvents', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'offerPopupEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(offerPopupEventHandlerMock).toHaveBeenCalledWith(mockRemoteMessage.data)
  })

  it('should call popup event when type is found in contractPopupEvents', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'contractPopupEvent',
        contractId: '1',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).toHaveBeenCalledWith(contract)
  })
  it('should not call popup event when type is found in contractPopupEvents but no contract id is given', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'contractPopupEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).not.toHaveBeenCalled()
  })

  it('should not call popup event when type is found in contractPopupEvents but contract data is missing', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'contractPopupEvent',
        contractId: '1-2',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    ;(getContract as jest.Mock).mockReturnValue(undefined)
    ;(getContractAPI as jest.Mock).mockResolvedValue([null])
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(contractPopupEventHandlerMock).not.toHaveBeenCalled()
  })

  it('should call state update event when type is found in stateUpdateEvents', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'stateUpdateEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(stateUpdateEventHandlerMock).toHaveBeenCalledWith(mockRemoteMessage.data)
  })

  it('should not call anything when data is undefined', async () => {
    const mockRemoteMessage = {
      data: undefined,
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(overlayEventHanderMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(offerPopupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(contractPopupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(stateUpdateEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(updateMessageMock).not.toHaveBeenCalled()
  })

  it('should not call anything when type is undefined', async () => {
    const mockRemoteMessage = {
      data: { someOtherData: 'someOtherData' },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(overlayEventHanderMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(offerPopupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(contractPopupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(stateUpdateEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(updateMessageMock).not.toHaveBeenCalled()
  })
})
