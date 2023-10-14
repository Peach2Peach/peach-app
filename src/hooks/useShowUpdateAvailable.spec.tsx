/* eslint-disable max-lines-per-function */
import { act } from 'react-test-renderer'
import { renderHook } from 'test-utils'
import { APPVERSION } from '../constants'
import { MessageContext, defaultMessageState } from '../contexts/message'
import { useConfigStore } from '../store/configStore'
import { linkToAppStore } from '../utils/system'
import { useShowUpdateAvailable } from './useShowUpdateAvailable'

describe('useShowUpdateAvailable', () => {
  const definitelyHigherVersion = '99.99.99'
  let messageState = { ...defaultMessageState }
  const updateMessage = jest.fn((newState) => (messageState = newState))
  const wrapper = ({ children }: { children: React.ReactElement }) => (
    <MessageContext.Provider value={[messageState, updateMessage]}>{children}</MessageContext.Provider>
  )
  beforeEach(() => {
    useConfigStore.getState().setLatestAppVersion(APPVERSION)
    useConfigStore.getState().setMinAppVersion(APPVERSION)
  })
  afterEach(() => {
    messageState = { ...defaultMessageState }
  })
  it('does not show update available banner if app version is above min/latest', () => {
    renderHook(useShowUpdateAvailable, { wrapper })

    expect(updateMessage).not.toHaveBeenCalled()
  })
  it('does show update available banner if app version is not above latest', () => {
    useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion)

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
    useConfigStore.getState().setMinAppVersion(definitelyHigherVersion)

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
    useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion)
    useConfigStore.getState().setMinAppVersion(definitelyHigherVersion)

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

    expect(updateMessage).not.toHaveBeenCalled()
    act(() => {
      useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion)
    })
    expect(updateMessage).toHaveBeenCalled()
  })
})
