import { renderHook } from '@testing-library/react-native'
import { useShowBackupReminder } from './useShowBackupReminder'

const useSettingsStoreMock = jest.fn((selector) => selector({ lastFileBackupDate: null }))
jest.mock('../store/settingsStore', () => ({
  useSettingsStore: (selector: any) => useSettingsStoreMock(selector),
}))

jest.mock('./useShowWarning', () => ({
  useShowWarning: jest.fn((type) => type),
}))

describe('useShowBackupReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns showFirstBackupWarning when lastFileBackupDate is falsy', () => {
    const { result } = renderHook(useShowBackupReminder)
    expect(result.current).toEqual('firstBackup')
  })

  it('returns showPaymentBackupWarning when lastFileBackupDate is truthy', () => {
    useSettingsStoreMock.mockImplementationOnce((selector) =>
      selector({ lastFileBackupDate: '2022-03-19T10:21:32.000Z' }),
    )
    const { result } = renderHook(useShowBackupReminder)
    expect(result.current).toEqual('paymentBackup')
  })
})
