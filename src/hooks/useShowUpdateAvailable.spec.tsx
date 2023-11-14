import { act } from 'react-test-renderer'
import { renderHook } from 'test-utils'
import { defaultState, useMessageState } from '../components/message/useMessageState'
import { APPVERSION } from '../constants'
import { useConfigStore } from '../store/configStore/configStore'
import { linkToAppStore } from '../utils/system'
import { useShowUpdateAvailable } from './useShowUpdateAvailable'

describe('useShowUpdateAvailable', () => {
  const definitelyHigherVersion = '99.99.99'
  beforeEach(() => {
    useConfigStore.getState().setLatestAppVersion(APPVERSION)
    useConfigStore.getState().setMinAppVersion(APPVERSION)
    useMessageState.setState(defaultState)
  })
  it('does not show update available banner if app version is above min/latest', () => {
    renderHook(useShowUpdateAvailable)
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
  it('does show update available banner if app version is not above latest', () => {
    useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable)

    expect(useMessageState.getState()).toEqual(
      expect.objectContaining({
        action: {
          callback: linkToAppStore,
          icon: 'download',
          label: 'download',
        },
        keepAlive: true,
        level: 'WARN',
        msgKey: 'UPDATE_AVAILABLE',
      }),
    )
  })
  it('does show critical update available banner if app version is not above min', () => {
    useConfigStore.getState().setMinAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable)

    expect(useMessageState.getState()).toEqual(
      expect.objectContaining({
        action: {
          callback: linkToAppStore,
          icon: 'download',
          label: 'download',
        },
        keepAlive: true,
        level: 'ERROR',
        msgKey: 'CRITICAL_UPDATE_AVAILABLE',
      }),
    )
  })
  it('does still show critical update available banner if app version is not above min/latest', () => {
    useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion)
    useConfigStore.getState().setMinAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable)

    expect(useMessageState.getState()).toEqual(
      expect.objectContaining({
        action: {
          callback: linkToAppStore,
          icon: 'download',
          label: 'download',
        },
        keepAlive: true,
        level: 'ERROR',
        msgKey: 'CRITICAL_UPDATE_AVAILABLE',
      }),
    )
  })
  it('shows update banner should the min/latest version change during the session', () => {
    renderHook(useShowUpdateAvailable)

    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
    act(() => {
      useConfigStore.getState().setLatestAppVersion(definitelyHigherVersion)
    })
    expect(useMessageState.getState()).toEqual(
      expect.objectContaining({
        action: {
          callback: linkToAppStore,
          icon: 'download',
          label: 'download',
        },
        keepAlive: true,
        level: 'WARN',
        msgKey: 'UPDATE_AVAILABLE',
      }),
    )
  })
})
