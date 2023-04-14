import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { APPVERSION } from '../constants'
import { configStore, useConfigStore } from '../store/configStore'
import { useShowUpdateAvailable } from './useShowUpdateAvailable'

const updateMessageMock = jest.fn()
jest.mock('../contexts/message', () => ({
  useMessageContext: () => [, updateMessageMock],
}))

describe('useShowUpdateAvailable', () => {
  const definitelyHigherVersion = '99.99.99'
  beforeEach(() => {
    configStore.getState().setLatestAppVersion(APPVERSION)
    configStore.getState().setMinAppVersion(APPVERSION)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('does not show update available banner if app version is above min/latest', async () => {
    renderHook(useShowUpdateAvailable)

    expect(updateMessageMock).not.toHaveBeenCalled()
  })
  it('does show update available banner if app version is not above latest', async () => {
    configStore.getState().setLatestAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable)
    expect(updateMessageMock.mock.calls[0]).toMatchSnapshot()
  })
  it('does show critical update available banner if app version is not above min', async () => {
    configStore.getState().setMinAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable)
    expect(updateMessageMock.mock.calls[0]).toMatchSnapshot()
  })
  it('does still show critical update available banner if app version is not above min/latest', async () => {
    configStore.getState().setLatestAppVersion(definitelyHigherVersion)
    configStore.getState().setMinAppVersion(definitelyHigherVersion)

    renderHook(useShowUpdateAvailable)
    expect(updateMessageMock.mock.calls[0]).toMatchSnapshot()
  })
  it('shows update banner should the min/latest version change during the session', async () => {
    renderHook(useShowUpdateAvailable)
    const { result: configStoreResult } = renderHook(() => useConfigStore((state) => state))

    expect(updateMessageMock).not.toHaveBeenCalled()
    act(() => {
      configStoreResult.current.setLatestAppVersion(definitelyHigherVersion)
    })
    expect(updateMessageMock).toHaveBeenCalled()
  })
})
