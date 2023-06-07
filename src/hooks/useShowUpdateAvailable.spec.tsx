/* eslint-disable max-lines-per-function */
import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { APPVERSION } from '../constants'
import { configStore, useConfigStore } from '../store/configStore'
import { useShowUpdateAvailable } from './useShowUpdateAvailable'
import { MessageContext, defaultMessageState } from '../contexts/message'
import { linkToAppStore } from '../utils/system'

describe('useShowUpdateAvailable', () => {
  const definitelyHigherVersion = '99.99.99'
  let messageState = { ...defaultMessageState }
  const updateMessage = jest.fn((newState) => (messageState = newState))
  const wrapper = ({ children }: any) => (
    <MessageContext.Provider value={[messageState, updateMessage]}>{children}</MessageContext.Provider>
  )
  beforeEach(() => {
    configStore.getState().setLatestAppVersion(APPVERSION)
    configStore.getState().setMinAppVersion(APPVERSION)
  })
  afterEach(() => {
    jest.clearAllMocks()
    messageState = { ...defaultMessageState }
  })
  it('does not show update available banner if app version is above min/latest', () => {
    renderHook(useShowUpdateAvailable, { wrapper })

    expect(updateMessage).not.toHaveBeenCalled()
  })
  it('does show update available banner if app version is not above latest', () => {
    configStore.getState().setLatestAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable, { wrapper })

    expect(messageState).toEqual({
      action: {
        callback: linkToAppStore,
        icon: 'download',
        label: 'download',
      },
      keepAlive: true,
      level: 'WARN',
      msgKey: 'UPDATE_AVAILABLE',
    })
  })
  it('does show critical update available banner if app version is not above min', () => {
    configStore.getState().setMinAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable, { wrapper })

    expect(messageState).toEqual({
      action: {
        callback: linkToAppStore,
        icon: 'download',
        label: 'download',
      },
      keepAlive: true,
      level: 'ERROR',
      msgKey: 'CRITICAL_UPDATE_AVAILABLE',
    })
  })
  it('does still show critical update available banner if app version is not above min/latest', () => {
    configStore.getState().setLatestAppVersion(definitelyHigherVersion)
    configStore.getState().setMinAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable, { wrapper })

    expect(messageState).toEqual({
      action: {
        callback: linkToAppStore,
        icon: 'download',
        label: 'download',
      },
      keepAlive: true,
      level: 'ERROR',
      msgKey: 'CRITICAL_UPDATE_AVAILABLE',
    })
  })
  it('shows update banner should the min/latest version change during the session', () => {
    renderHook(useShowUpdateAvailable, { wrapper })

    const { result: configStoreResult } = renderHook(() => useConfigStore((state) => state))

    expect(updateMessage).not.toHaveBeenCalled()
    act(() => {
      configStoreResult.current.setLatestAppVersion(definitelyHigherVersion)
    })
    expect(updateMessage).toHaveBeenCalled()
  })
})
