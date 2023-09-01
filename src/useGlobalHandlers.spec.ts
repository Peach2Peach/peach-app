import { renderHook } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { Props, useGlobalHandlers } from './useGlobalHandlers'

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: { EUR: 20000, CHF: 20000 },
})
jest.mock('./hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))
const useShouldShowBackupReminderMock = jest.fn()
jest.mock('./hooks/useShouldShowBackupReminder', () => ({
  useShouldShowBackupReminder: () => useShouldShowBackupReminderMock(),
}))
const useInitialNavigationMock = jest.fn()
jest.mock('./init/useInitialNavigation', () => ({
  useInitialNavigation: () => useInitialNavigationMock(),
}))
const useShowUpdateAvailableMock = jest.fn()
jest.mock('./hooks/useShowUpdateAvailable', () => ({
  useShowUpdateAvailable: () => useShowUpdateAvailableMock(),
}))
const useDynamicLinksMock = jest.fn()
jest.mock('./hooks/useDynamicLinks', () => ({
  useDynamicLinks: () => useDynamicLinksMock(),
}))
const useCheckFundingMultipleEscrowsMock = jest.fn()
jest.mock('./hooks/useCheckFundingMultipleEscrows', () => ({
  useCheckFundingMultipleEscrows: () => useCheckFundingMultipleEscrowsMock(),
}))
const useHandleNotificationsMock = jest.fn()
jest.mock('./hooks/notifications/useHandleNotifications', () => ({
  useHandleNotifications: () => useHandleNotificationsMock(),
}))

const wrapper = NavigationAndQueryClientWrapper

describe('useGlobalHandlers', () => {
  const initialProps: Props = {
    currentPage: 'home',
  }
  it('should call useShouldShowBackupReminder', () => {
    renderHook(useGlobalHandlers, { wrapper, initialProps })
    expect(useShouldShowBackupReminderMock).toHaveBeenCalled()
  })
  it('should call useInitialNavigation', () => {
    renderHook(useGlobalHandlers, { wrapper, initialProps })
    expect(useInitialNavigationMock).toHaveBeenCalled()
  })
  it('should call useShowUpdateAvailable', () => {
    renderHook(useGlobalHandlers, { wrapper, initialProps })
    expect(useShowUpdateAvailableMock).toHaveBeenCalled()
  })
  it('should call useDynamicLinks', () => {
    renderHook(useGlobalHandlers, { wrapper, initialProps })
    expect(useDynamicLinksMock).toHaveBeenCalled()
  })
  it('should call useCheckFundingMultipleEscrows', () => {
    renderHook(useGlobalHandlers, { wrapper, initialProps })
    expect(useCheckFundingMultipleEscrowsMock).toHaveBeenCalled()
  })
  it('should call useHandleNotifications', () => {
    renderHook(useGlobalHandlers, { wrapper, initialProps })
    expect(useHandleNotificationsMock).toHaveBeenCalled()
  })
})
