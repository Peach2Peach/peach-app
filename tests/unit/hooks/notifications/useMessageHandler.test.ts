import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { act, renderHook } from '@testing-library/react-hooks'
import { useMessageHandler } from '../../../../src/hooks/notifications/useMessageHandler'

const updateMessageMock = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => [undefined, updateMessageMock],
}))
const overlayEventHanderMock = jest.fn()
const overlayEvents = { overlayEvent: overlayEventHanderMock }
jest.mock('../../../../src/hooks/notifications/global/useOverlayEvents', () => ({
  useOverlayEvents: () => overlayEvents,
}))

const popupEventHandlerMock = jest.fn()
const popupEvents = { popupEvent: popupEventHandlerMock }
jest.mock('../../../../src/hooks/notifications/global/usePopupEvents', () => ({
  usePopupEvents: () => popupEvents,
}))

const stateUpdateEventHandlerMock = jest.fn()
const stateUpdateEvents = { stateUpdateEvent: stateUpdateEventHandlerMock }
jest.mock('../../../../src/hooks/notifications/global/useStateUpdateEvents', () => ({
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

  it('should call popup event when type is found in popupEvents', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'popupEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler(mockGetCurrentPage))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(popupEventHandlerMock).toHaveBeenCalledWith(mockRemoteMessage.data)
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
    expect(popupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
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
    expect(popupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(stateUpdateEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(updateMessageMock).not.toHaveBeenCalled()
  })
})
