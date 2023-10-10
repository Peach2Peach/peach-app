import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { act, renderHook } from '@testing-library/react-native'
import { AppState } from 'react-native'
import { contract } from '../../../tests/unit/data/contractData'
import { getContract } from '../../utils/contract'
import { getContract as getContractAPI } from '../../utils/peachAPI'
import { useMessageHandler } from './useMessageHandler'

const updateMessageMock = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => [undefined, updateMessageMock],
}))
const overlayEventHanderMock = jest.fn()
const overlayEvents = { overlayEvent: overlayEventHanderMock }
jest.mock('./eventHandler/useOverlayEvents', () => ({
  useOverlayEvents: () => overlayEvents,
}))

const offerPopupEventHandlerMock = jest.fn()
const offerPopupEvents = { offerPopupEvent: offerPopupEventHandlerMock }
jest.mock('./eventHandler/offer/useOfferPopupEvents', () => ({
  useOfferPopupEvents: () => offerPopupEvents,
}))

jest.mock('../../utils/contract', () => ({
  getContract: jest.fn(),
}))
jest.mock('../../utils/peachAPI', () => ({
  getContract: jest.fn(),
}))

const stateUpdateEventHandlerMock = jest.fn()
const stateUpdateEvents = { stateUpdateEvent: stateUpdateEventHandlerMock }
jest.mock('./eventHandler/useStateUpdateEvents', () => ({
  useStateUpdateEvents: () => stateUpdateEvents,
}))

const actionMock = {
  label: 'action',
  icon: 'icon',
  callback: jest.fn(),
}
const getPNActionHandlerMock = jest.fn().mockReturnValue(actionMock)
jest.mock('./useGetPNActionHandler', () => ({
  useGetPNActionHandler: () => getPNActionHandlerMock,
}))

// eslint-disable-next-line max-lines-per-function
describe('useMessageHandler', () => {
  beforeEach(() => {
    (getContract as jest.Mock).mockReturnValue(contract)
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
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler('home'))
    AppState.currentState = 'active'
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
  it('should not call updateMessage when type is not found and appstate is background', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'SOME_TYPE',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler('home'))
    AppState.currentState = 'background'

    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(updateMessageMock).not.toHaveBeenCalled()
  })

  it('should call overlay event when type is found in overlayEvents', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'overlayEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler('home'))
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
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler('home'))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(offerPopupEventHandlerMock).toHaveBeenCalledWith(mockRemoteMessage.data, mockRemoteMessage.notification)
  })

  it('should call state update event when type is found in stateUpdateEvents', async () => {
    const mockRemoteMessage = {
      data: {
        type: 'stateUpdateEvent',
      },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler('home'))
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
    const { result: onMessageHandler } = renderHook(() => useMessageHandler('home'))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(overlayEventHanderMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(offerPopupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(stateUpdateEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(updateMessageMock).not.toHaveBeenCalled()
  })

  it('should not call anything when type is undefined', async () => {
    const mockRemoteMessage = {
      data: { someOtherData: 'someOtherData' },
      notification: {
        bodyLocArgs: ['arg1', 'arg2'],
      },
      fcmOptions: {},
    } as FirebaseMessagingTypes.RemoteMessage
    const { result: onMessageHandler } = renderHook(() => useMessageHandler('home'))
    await act(async () => {
      await onMessageHandler.current(mockRemoteMessage)
    })

    expect(overlayEventHanderMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(offerPopupEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(stateUpdateEventHandlerMock).not.toHaveBeenCalledWith(mockRemoteMessage.data)
    expect(updateMessageMock).not.toHaveBeenCalled()
  })
})
