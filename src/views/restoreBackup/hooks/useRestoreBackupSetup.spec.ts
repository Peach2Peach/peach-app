import { renderHook } from '@testing-library/react-native'
import { tabs, useRestoreBackupSetup } from './useRestoreBackupSetup'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { act } from 'react-test-renderer'

const useRouteMock = jest.fn(() => ({ params: {} }))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('useRestoreBackupSetup', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns defaults', async () => {
    const { result } = renderHook(useRestoreBackupSetup, { wrapper: NavigationWrapper })

    expect(result.current).toEqual({
      tabs,
      currentTab: { id: 'fileBackup', display: 'file backup' },
      setCurrentTab: expect.any(Function),
    })
  })
  it('respects route params defaults', async () => {
    useRouteMock.mockReturnValueOnce({ params: { tab: 'seedPhrase' } })
    const { result } = renderHook(useRestoreBackupSetup, { wrapper: NavigationWrapper })

    expect(result.current).toEqual({
      tabs,
      currentTab: { id: 'seedPhrase', display: 'seed phrase' },
      setCurrentTab: expect.any(Function),
    })
  })
  it('changes current tab', async () => {
    const { result } = renderHook(useRestoreBackupSetup, { wrapper: NavigationWrapper })

    act(() => result.current.setCurrentTab(tabs[1]))
    expect(result.current).toEqual({
      tabs,
      currentTab: { id: 'seedPhrase', display: 'seed phrase' },
      setCurrentTab: expect.any(Function),
    })
  })
})
